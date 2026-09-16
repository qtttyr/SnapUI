import type { IRNode } from '../core/types.js';

export type StyleFlavor = 'css' | 'scss' | 'modules' | 'tailwind';
export type Framework = 'react' | 'vue' | 'svelte' | 'html';

export interface GenerateInput {
  componentName: string;
  framework: Framework;
  style: StyleFlavor;
  root: IRNode;
  textSample?: string;
}

export interface GeneratedFile {
  path: string;
  content: string;
}

export interface GenerateOutput {
  files: GeneratedFile[];
}
