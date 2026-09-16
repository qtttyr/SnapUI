import { pascal } from 'snapui-core';
import { buildMarkup } from './markup.js';
/** Generate a Svelte component. */
export function generateSvelte(componentName, root, style) {
    const name = pascal(componentName);
    const markup = buildMarkup(root, style);
    const kebab = name.replace(/([a-z0-9])([A-Z])/g, '$1-$2').toLowerCase();
    const scriptBlock = style === 'tailwind' ? '' : `<script>\n  import '../styles/${kebab}.css';\n</script>\n\n`;
    const styleBlock = style === 'tailwind'
        ? ''
        : `\n<style>\n/* Styles live in ../styles/${kebab}.css.\n   Move them here for component-scoped Svelte styles. */\n</style>\n`;
    return `<!--
  ${name}
  Captured with SnapUI — https://github.com/snapui
-->
${scriptBlock}${markup}
${styleBlock}`;
}
