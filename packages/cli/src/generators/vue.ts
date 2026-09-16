import { pascal } from '../core/naming.js';
import { buildMarkup } from './markup.js';
import type { IRNode } from '../core/types.js';
import type { StyleFlavor } from './types.js';

export function generateVue(componentName: string, root: IRNode, style: StyleFlavor): string {
  const name = pascal(componentName);
  const markup = buildMarkup(root, style);
  const hasStyles = style !== 'tailwind';

  const styleBlock = hasStyles
    ? `\n<style scoped>\n/* Styles are in ./styles/${kebab(name)}.css — import it globally,\n   or move them here if you prefer SFC-scoped styles. */\n</style>\n`
    : '';

  return `<!--
  ${name}
  Captured with SnapUI — https://github.com/snapui
-->
<script setup lang="ts">
${style === 'tailwind' ? '// Styling: Tailwind utility classes are embedded in the markup.' : `import '../styles/${kebab(name)}.css';`}
</script>

<template>
${indentBlock(markup, 1)}
</template>
${styleBlock}`;
}

function kebab(s: string): string {
  return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}

function indentBlock(s: string, levels: number): string {
  const pad = '  '.repeat(levels);
  return s.split('\n').map((l) => (l ? pad + l : l)).join('\n');
}
