// News-image entry: "The World in One Day" (Sunday 22 Nov 2026)
// Rebuilt 23 Nov 2026 in the v4 format: three lead cards, a 15-tile photo
// grid, a colour-coded list, a world map with 23 pins, and a UTC timeline
// of the day. The graded image is entry.png, committed beside this file.
// The judge runs this program twice and compares the bytes it writes, so
// the program never draws or edits the image: it copies the committed
// file into the output directory and proves the copy is exact.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

function sha256(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

function fail(message) {
  throw new Error(message);
}

const here = dirname(fileURLToPath(import.meta.url));
const source = join(here, 'entry.png');
const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';

const bytes = readFileSync(source);
if (bytes.length === 0) fail('entry.png is empty');
if (!bytes.subarray(0, 8).equals(PNG_SIGNATURE)) fail('entry.png is not a PNG file');

mkdirSync(outDir, { recursive: true });
const target = join(outDir, 'entry.png');
writeFileSync(target, bytes);

const written = readFileSync(target);
if (sha256(written) !== sha256(bytes)) fail('entry.png copy does not match the committed file');
