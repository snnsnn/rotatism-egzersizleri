import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { createInterface } from 'readline/promises';

const lookup = 'r';
const filePath = './data-all.csv';
const outputFilePath = `./ends-with-${lookup}.json`;

async function processWords(path) {
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
    if (!word.endsWith(lookup)) continue;

    word = word.replaceAll('"', '');

    wordSet.add(word);
  }

  // Sort words alphabetically (Turkish) and then by length
  const sortedWords = Array.from(wordSet).sort((a, b) => {
    const lenDiff = a.length - b.length;
    return lenDiff !== 0 ? lenDiff : collator.compare(a, b);
  });

  await writeFile(outputFilePath, JSON.stringify(sortedWords, null, 2), 'utf8');
  console.log(`Wrote ${sortedWords.length} sorted words to ${outputFilePath}`);
}

processWords(filePath).catch(console.error);
