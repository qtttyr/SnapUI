import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import type { GeneratedFile } from '@snapui/generators';
/** Write generated files to the target directory, returning absolute paths. */
export function writeFiles(files: GeneratedFile[], outDir: string): string[] {
  const written: string[] = [];
  for (const file of files) {
    const abs = resolve(outDir, file.path);
    mkdirSync(dirname(abs), { recursive: true });
    writeFileSync(abs, file.content, 'utf8');
    written.push(abs);
  }
  return written;
}
