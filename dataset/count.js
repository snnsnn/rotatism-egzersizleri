import { createReadStream } from 'fs';
import { writeFile } from 'fs/promises';
import { createInterface } from 'readline/promises';

const filePath = './data-all.csv';
const outputFilePath = './words-by-r-count.json';

async function processWordsByRCount(path) {
  const rMap = new Map();
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
    let word = cells[6];
    if (!word || !word.includes('r')) continue;

    word = word.replaceAll('"', '');

    const rCount = Array.from(word).filter(char => char === 'r').length;

    if (!rMap.has(rCount)) {
      rMap.set(rCount, new Set());
    }
    rMap.get(rCount).add(word);
  }

  // Convert to plain object with sorted values
  const output = {};
  for (const [rCount, wordSet] of rMap.entries()) {
    const sortedWords = Array.from(wordSet).sort(collator.compare);
    output[rCount] = sortedWords;
  }

  await writeFile(outputFilePath, JSON.stringify(output, null, 2), 'utf8');
  console.log(`Wrote words grouped by 'r' count to ${outputFilePath}`);
}

processWordsByRCount(filePath).catch(console.error);
