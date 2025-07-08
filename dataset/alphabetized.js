import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { createInterface } from 'readline/promises';

const filePath = './data-all.csv';
const outputFilePath = './alphabetical-words-starting-with-h-by-length.json';

async function getSixthCellPerLine(path) {
  const frequencyMap = new Map();
  const stream = createReadStream(path, { encoding: 'utf8' });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  const collator = new Intl.Collator('tr', { sensitivity: 'base' });

  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }

    const cells = line.split(',');
    const word = cells[6];
    if (!word) continue;
    if (!word.includes('r') || !word.startsWith('h')) continue;

    const len = Array.from(word).length;
    if (!frequencyMap.has(len)) {
      frequencyMap.set(len, new Set());
    }
    frequencyMap.get(len).add(word);
  }

  // Convert to plain object and sort words in Turkish alphabetical order
  const output = {};
  for (const [len, wordSet] of frequencyMap.entries()) {
    const sortedWords = Array.from(wordSet).sort(collator.compare);
    output[len] = sortedWords;
  }

  await writeFile(outputFilePath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Wrote ${Object.keys(output).length} entries to ${outputFilePath}`);
}

getSixthCellPerLine(filePath).catch(console.error);
