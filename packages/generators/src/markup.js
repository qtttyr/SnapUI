import { classNameOf, escapeHtml } from 'snapui-core';
import { tailwindClasses } from './tailwind.js';
const VOID_TAGS = new Set(['img', 'br', 'hr', 'input', 'source', 'area', 'base', 'col', 'embed', 'link', 'meta', 'track', 'wbr']);
function attrString(node, style) {
    const parts = [];
    const cls = classNameOf(node);
    if (style === 'tailwind') {
        const tw = tailwindClasses(node);
        if (tw.length)
            parts.push(`class="${tw.join(' ')}"`);
    }
    else if (cls) {
        parts.push(`class="${cls}"`);
    }
    for (const [name, value] of Object.entries(node.attrs)) {
        if (name === 'data-snap-class')
            continue;
        if (name === 'class') {
            // keep extra classes beyond the reused first one
            if (style === 'tailwind')
                parts.push(`class="${escapeHtml(value)}"`);
            continue;
        }
        parts.push(`${name}="${escapeHtml(value)}"`);
    }
    return parts.length ? ' ' + parts.join(' ') : '';
}
/**
 * Build the HTML markup for the IR tree (shared by all framework generators).
 * Text is emitted as-is inside the parent element.
 */
export function buildMarkup(root, style, indent = 0) {
    const pad = '  '.repeat(indent);
    if (root.tag === '#svg') {
        // Inline SVG as captured.
        return root.text ? indentElement(root.text, indent) : '';
    }
    const attrs = attrString(root, style);
    const text = root.text ? escapeHtml(root.text) : '';
    if (VOID_TAGS.has(root.tag)) {
        return `${pad}<${root.tag}${attrs} />`;
    }
    if (!root.children.length) {
        return text ? `${pad}<${root.tag}${attrs}>${text}</${root.tag}>` : `${pad}<${root.tag}${attrs} />`;
    }
    const inner = root.children.map((c) => buildMarkup(c, style, indent + 1)).filter(Boolean).join('\n');
    const combined = text ? `${pad}  ${text}\n${inner}` : inner;
    return `${pad}<${root.tag}${attrs}>\n${combined}\n${pad}</${root.tag}>`;
}
function indentElement(html, indent) {
    const pad = '  '.repeat(indent);
    return html.split('\n').map((line, i) => (i === 0 ? line : pad + line)).join('\n');
}
