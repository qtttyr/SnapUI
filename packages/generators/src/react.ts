import type { IRNode } from '@snapui/core';
import { classNameOf, escapeHtml, escapeJs, pascal } from '@snapui/core';
import type { StyleFlavor } from './types.js';
import { tailwindClasses } from './tailwind.js';

const VOID_TAGS = new Set(['img', 'br', 'hr', 'input', 'source']);

/** Sanitize a class name for use as a JSX className. */
function safeClass(name: string): string {
  return name;
}


/** Build JSX markup (React-flavored: className, self-closing voids). */
export function buildJsx(root: IRNode, style: StyleFlavor, indent = 0, isRoot = true): string {
  const pad = '  '.repeat(indent);
  if (root.tag === '#svg') {
    return root.text ? root.text.split('\n').map((l, i) => (i ? pad + l : l)).join('\n') : '';
  }
  const attrs: string[] = [];
  if (style === 'tailwind') {
    const tw = tailwindClasses(root);
    if (isRoot) {
      attrs.push(`className={["${tw.join(' ')}", className].filter(Boolean).join(' ')}`);
    } else if (tw.length) {
      attrs.push(`className="${tw.join(' ')}"`);
    }
  } else {
    const cls = classNameOf(root);
    if (cls) {
      if (isRoot) {
        attrs.push(
          style === 'modules'
            ? `className={[styles[${JSON.stringify(cls)}], className].filter(Boolean).join(' ')}`
            : `className={["${cls}", className].filter(Boolean).join(' ')}`,
        );
      } else {
        attrs.push(
          style === 'modules' ? `className={styles[${JSON.stringify(cls)}]}` : `className="${cls}"`,
        );
      }
    } else if (isRoot) {
      attrs.push(`className={className}`);
    }
  }
  if (isRoot) {
    attrs.push(`{...props}`);
  }
  for (const [name, value] of Object.entries(root.attrs)) {
    if (name === 'data-snap-class' || name === 'class') continue;
    const jsxName = JSX_ATTR_MAP[name] ?? name;
    if (jsxName === 'srcSet' || jsxName === 'style' || name === 'style') continue;
    attrs.push(`${jsxName}="${escapeHtml(value)}"`);
  }
  const attrStr = attrs.length ? ' ' + attrs.join(' ') : '';
  const text = root.text ? escapeJsText(root.text) : '';

  if (VOID_TAGS.has(root.tag)) return `${pad}<${root.tag}${attrStr} />`;
  if (!root.children.length) {
    return text ? `${pad}<${root.tag}${attrStr}>${text}</${root.tag}>` : `${pad}<${root.tag}${attrStr} />`;
  }
  const inner = root.children.map((c) => buildJsx(c, style, indent + 1, false)).filter(Boolean).join('\n');
  const combined = text ? `${pad}  {${jsString(root.text!)}}\n${inner}` : inner;
  return `${pad}<${root.tag}${attrStr}>\n${combined}\n${pad}</${root.tag}>`;
}

function jsString(s: string): string {
  return '`' + escapeJs(s) + '`';
}

function escapeJsText(s: string): string {
  return escapeHtml(s).replace(/{/g, '&#123;').replace(/}/g, '&#125;');
}

const JSX_ATTR_MAP: Record<string, string> = {
  for: 'htmlFor',
  srcset: 'srcSet',
  tabindex: 'tabIndex',
  contenteditable: 'contentEditable',
};

/** Generate a React (TSX) component file. */
export function generateReact(
  componentName: string,
  root: IRNode,
  style: StyleFlavor,
): string {
  const name = pascal(componentName);
  const markup = buildJsx(root, style, 0, true);
  const cssImport =
    style === 'css' ? `import './${name}.css';\n` : style === 'modules' ? `import styles from './${name}.module.css';\n` : '';
  const propsBlock = `export interface ${name}Props extends React.HTMLAttributes<HTMLElement> {\n  className?: string;\n}\n\n`;
  const body = `export function ${name}({ className, ...props }: ${name}Props) {\n  return (\n${indentBlock(markup, 2)}\n  );\n}\n`;
  return `${header(name)}import type React from 'react';\n${cssImport}\n${propsBlock}${body}`;
}

function indentBlock(s: string, levels: number): string {
  const pad = '  '.repeat(levels);
  return s.split('\n').map((l) => (l ? pad + l : l)).join('\n');
}

function header(name: string): string {
  return `/**\n * ${name}\n * Captured with SnapUI — https://github.com/qtttyr/SnapUI\n * Auto-generated from a live DOM capture. Review & refine freely.\n */\n`;
}

/** Used by vue/svelte/html generators for the module style import. */
export function modulePrefix(style: StyleFlavor): string {
  return style === 'modules' ? 'styles.' : '';
}

export type { IRNode };
