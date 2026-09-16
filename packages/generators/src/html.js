import { buildMarkup } from './markup.js';
function cssName(s) {
    return s
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/[\s_]+/g, '-')
        .toLowerCase();
}
/** Generate a standalone HTML fragment. */
export function generateHtml(componentName, root, style) {
    const markup = buildMarkup(root, style);
    const note = style === 'tailwind'
        ? '<!-- Tailwind utility classes are embedded in the markup -->'
        : `<!-- Link this stylesheet from your page: ./styles/${cssName(componentName)}.css -->`;
    return `<!-- ${componentName} — captured with SnapUI (https://github.com/snapui) -->
${note}

${markup}
`;
}
