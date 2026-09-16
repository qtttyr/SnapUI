import { pascal } from 'snapui-core';
import { buildMarkup } from './markup.js';
/** Generate a Vue 3 SFC with scoped styles (CSS flavors only). */
export function generateVue(componentName, root, style) {
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
function kebab(s) {
    return s.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
}
function indentBlock(s, levels) {
    const pad = '  '.repeat(levels);
    return s.split('\n').map((l) => (l ? pad + l : l)).join('\n');
}
