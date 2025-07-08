import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { createInterface } from 'readline/promises';

const lookup = /^.{1,3}r$/;
const filePath = './data-all.csv';
const outputFilePath = `./filtered.txt`;

async function getSixthCellPerLine(path) {
  const wordSet = new Set();
  const stream = createReadStream(path, { encoding: 'utf8' });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  const collator = new Intl.Collator('tr', { sensitivity: 'base' });

  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }

    let word = line.split(',')[6];
    if (!word) continue;
    if (!lookup.test(word)) continue;
    word = word.replaceAll('"', '');

    wordSet.add(word);
  }

  // Sort words alphabetically (Turkish) and then by LENGTH
  const sortedWords = Array.from(wordSet).sort((a, b) => {
    const lenDiff = a.length - b.length;
    return lenDiff !== 0 ? lenDiff : collator.compare(a, b);
  });

  // Join all words into a single string with line breaks
  const outputText = sortedWords.join('\n');
  await writeFile(outputFilePath, outputText, 'utf8');
  console.log(`Wrote ${sortedWords.length} sorted words to ${outputFilePath}`);
}

getSixthCellPerLine(filePath).catch(console.error);
