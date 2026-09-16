export * from './types.js';
export { generateCss, cssDeclarations } from './style-engine.js';
export { tailwindClasses } from './tailwind.js';
export { buildMarkup } from './markup.js';
import type { GenerateInput, GeneratedFile } from './types.js';
/**
 * Main entry: turn a GenerateInput into the full set of output files.
 * Layout: components/<Name>.<ext> + styles/<name>.css
 */
export declare function generate(input: GenerateInput): GeneratedFile[];
/** Storybook stories for a React component. */
export declare function generateStories(name: string): string;
