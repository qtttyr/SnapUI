import type { IRNode } from '../core/types.js';
import { classNameOf, escapeHtml } from '../core/naming.js';
import type { StyleFlavor } from './types.js';
import { tailwindClasses } from './tailwind.js';

const VOID_TAGS = new Set(['img', 'br', 'hr', 'input', 'source', 'area', 'base', 'col', 'embed', 'link', 'meta', 'track', 'wbr']);

function attrString(node: IRNode, style: StyleFlavor): string {
  const parts: string[] = [];
  const cls = classNameOf(node);
  if (style === 'tailwind') {
    const tw = tailwindClasses(node);
    if (tw.length) parts.push(`class="${tw.join(' ')}"`);
  } else if (cls) {
    parts.push(`class="${cls}"`);
  }
  for (const [name, value] of Object.entries(node.attrs)) {
    if (name === 'data-snap-class') continue;
    if (name === 'class') {
      if (style === 'tailwind') parts.push(`class="${escapeHtml(value)}"`);
      continue;
    }
    parts.push(`${name}="${escapeHtml(value)}"`);
  }
  return parts.length ? ' ' + parts.join(' ') : '';
}

export function buildMarkup(root: IRNode, style: StyleFlavor, indent = 0): string {
  const pad = '  '.repeat(indent);
  if (root.tag === '#svg') {
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

function indentElement(html: string, indent: number): string {
  const pad = '  '.repeat(indent);
  return html.split('\n').map((line, i) => (i === 0 ? line : pad + line)).join('\n');
}
