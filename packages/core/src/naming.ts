import type { IRNode } from './types.js';

export function kebab(s: string): string {
  return s
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '')
    .toLowerCase()
    .replace(/^-+|-+$/g, '') || 'el';
}

export function pascal(s: string): string {
  return s
    .split(/[-\s_]/)
    .filter(Boolean)
    .map((p) => p[0].toUpperCase() + p.slice(1))
    .join('') || 'Component';
}

export function camel(s: string): string {
  const p = pascal(s);
  return p[0].toLowerCase() + p.slice(1);
}

export function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function escapeJs(s: string): string {
  return s.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
}

const SKIP_TAGS = new Set(['svg', 'path', 'circle', 'rect', 'line', 'polyline', 'polygon', 'g', 'defs', 'use', '#svg']);

/** Framework hash classes (Astro, React JSX, CSS Modules, Svelte, Angular, Styled Components). */
export const JUNK_CLASS_RE = /^(astro-[a-z0-9]+|jsx-\d+|css-[a-z0-9]+|s-[a-z0-9]+|data-v-[a-z0-9]+|ng-[a-z0-9]+|sc-[a-zA-Z0-9]+|__[a-z0-9_-]+|\d+|[0-9a-f]{6,})$/i;

/** Filter out framework hash junk classes from a list of class names. */
export function cleanClasses(classes: string[]): string[] {
  return classes.filter((c) => c && !JUNK_CLASS_RE.test(c) && /^[a-zA-Z][\w-]*$/.test(c));
}

/**
 * Assign readable, unique class names to every node in the IR tree.
 * Root uses the component name; children use `component__tag(n)` BEM-style.
 */
export function assignClassNames(root: IRNode, componentName: string): void {
  const used = new Set<string>();
  const base = kebab(componentName);

  function unique(name: string): string {
    let candidate = name;
    let i = 2;
    while (used.has(candidate)) candidate = `${name}-${i++}`;
    used.add(candidate);
    return candidate;
  }

  function walk(node: IRNode, parentClass: string | null): void {
    const raw = (node.attrs.class as string | undefined)?.trim();
    const rawList = raw ? raw.split(/\s+/) : [];
    const validClasses = cleanClasses(rawList);
    const semanticClass = validClasses[0] || null;

    let name: string;
    if (node === root) {
      name = unique(base);
    } else if (semanticClass) {
      // Reuse the site's own meaningful class name (cleaned for uniqueness).
      name = unique(kebab(semanticClass));
    } else if (SKIP_TAGS.has(node.tag)) {
      node.attrs['data-snap-class'] = '__skip__';
      for (const c of node.children) walk(c, null);
      return;
    } else {
      const parentBase = parentClass ?? base;
      name = unique(`${parentBase}__${kebab(node.tag)}`);
    }
    node.attrs['data-snap-class'] = name;
    for (const c of node.children) walk(c, name);
  }

  walk(root, null);
}

/** Read back the assigned class name for a node. */
export function classNameOf(node: IRNode): string | null {
  const n = node.attrs['data-snap-class'];
  return !n || n === '__skip__' ? null : n;
}

/** Collect all nodes with assigned classes, in document order. */
export function classedNodes(root: IRNode): IRNode[] {
  const out: IRNode[] = [];
  const stack = [root];
  while (stack.length) {
    const n = stack.pop()!;
    if (n.attrs['data-snap-class'] && n.attrs['data-snap-class'] !== '__skip__') out.push(n);
    for (let i = n.children.length - 1; i >= 0; i--) stack.push(n.children[i]);
  }
  return out;
}
