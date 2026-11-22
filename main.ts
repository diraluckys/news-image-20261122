// News-image entry (Node 22, standard library only). The graded image is the
// entry.png committed beside this program. The judge runs this program twice
// and compares the bytes it writes, so the program must never touch the
// image itself: it only copies the committed file into the output directory.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const outDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
const source = new URL('./entry.png', import.meta.url);

if (!existsSync(source)) {
  throw new Error('entry.png is missing from the repository');
}
if (!existsSync(outDir)) {
  mkdirSync(outDir, { recursive: true });
}

const target = join(outDir, 'entry.png');
copyFileSync(source, target);

// Guard against a partial write: the graded bytes must be exactly the
// committed file, so refuse to finish if the copy came out short.
if (statSync(target).size !== statSync(source).size) {
  throw new Error('entry.png copy is incomplete');
}
