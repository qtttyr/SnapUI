import { buildMarkup } from './markup.js';
import type { IRNode } from '../core/types.js';
import type { StyleFlavor } from './types.js';

function cssName(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

export function generateHtml(componentName: string, root: IRNode, style: StyleFlavor): string {
  const markup = buildMarkup(root, style);
  const note =
    style === 'tailwind'
      ? '<!-- Tailwind utility classes are embedded in the markup -->'
      : `<!-- Link this stylesheet from your page: ./styles/${cssName(componentName)}.css -->`;

  return `<!-- ${componentName} — captured with SnapUI (https://github.com/qtttyr/SnapUI) -->
${note}

${markup}
`;
}
