import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { createInterface } from 'readline/promises';

const lookup = 'r';
const filePath = './data-all.csv';
const outputFilePath = `./${lookup}-by-length.json`;

async function getSixthCellPerLine(path) {
  const frequencyMap = new Map();
  const stream = createReadStream(path, { encoding: 'utf8' });
  const rl = createInterface({ input: stream, crlfDelay: Infinity });

  let isFirstLine = true;

  for await (const line of rl) {
    if (isFirstLine) {
      isFirstLine = false;
      continue;
    }

    const cells = line.split(',');
    const word = cells[6];

    if (!word) continue;
    if (!word.includes(lookup)) continue;

    const len = Array.from(word).length;
    if (!frequencyMap.has(len)) frequencyMap.set(len, new Set());
    frequencyMap.get(len).add(word);
  }

  // Convert to plain object
  const output = {};
  for (const [len, wordSet] of frequencyMap.entries()) {
    output[len] = Array.from(wordSet);
  }

  await writeFile(outputFilePath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Wrote ${Object.keys(output).length} entries to ${outputFilePath}`);
}

getSixthCellPerLine(filePath).catch(console.error);
