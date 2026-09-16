import { pascal } from '../core/naming.js';
import { buildMarkup } from './markup.js';
import type { IRNode } from '../core/types.js';
import type { StyleFlavor } from './types.js';

export function generateSvelte(componentName: string, root: IRNode, style: StyleFlavor): string {
  const name = pascal(componentName);
  const markup = buildMarkup(root, style);
  const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();

  const scriptBlock = style === 'tailwind' ? '' : `<script>\n  import '../styles/${kebab}.css';\n</script>\n\n`;
  const styleBlock =
    style === 'tailwind'
      ? ''
      : `\n<style>\n/* Styles live in ../styles/${kebab}.css.\n   Move them here for component-scoped Svelte styles. */\n</style>\n`;

  return `<!--
  ${name}
  Captured with SnapUI — https://github.com/qtttyr/SnapUI
-->
${scriptBlock}${markup}
${styleBlock}`;
}
