import type { IRNode } from '../core/types.js';

const TW_COLORS: Record<string, string> = {
  '#fff': 'white', '#ffffff': 'white', '#000': 'black', '#000000': 'black',
  'rgb(255,255,255)': 'white', 'rgb(0,0,0)': 'black', 'rgba(0,0,0,0)': 'transparent',
};

function px(value: string): number | null {
  const m = /^(-?[\d.]+)px$/.exec(value.trim());
  return m ? Number.parseFloat(m[1]) : null;
}

function spacing(v: number): string {
  const quarters = v / 4;
  if (Number.isInteger(quarters)) return `${quarters}`.replace('.', '_');
  return `[${v}px]`;
}

function twColor(value: string): string {
  const lower = value.toLowerCase().replace(/\s+/g, '');
  if (TW_COLORS[lower]) return TW_COLORS[lower];
  if (/^#([0-9a-f]{3,8})$/.test(lower)) return `[${lower}]`;
  if (/^rgba?\([^)]+\)$/.test(lower)) return `[${lower}]`;
  return value;
}

const FONT_WEIGHTS: Record<string, string> = {
  '100': 'thin', '200': 'extralight', '300': 'light', '400': 'normal',
  '500': 'medium', '600': 'semibold', '700': 'bold', '800': 'extrabold', '900': 'black',
};

function pick(map: Record<string, string>, v: string): string[] {
  const m = map[v];
  return m ? [m] : [];
}

function toTailwind(prop: string, value: string): string[] {
  const v = value.trim();
  const p = px(v);
  switch (prop) {
    case 'display': return pick({ flex: 'flex', 'inline-flex': 'inline-flex', grid: 'grid', block: 'block', 'inline-block': 'inline-block', inline: 'inline', none: 'hidden' }, v);
    case 'position': return pick({ relative: 'relative', absolute: 'absolute', fixed: 'fixed', sticky: 'sticky', static: 'static' }, v);
    case 'flex-direction': return pick({ row: 'flex-row', column: 'flex-col', 'row-reverse': 'flex-row-reverse', 'column-reverse': 'flex-col-reverse' }, v);
    case 'align-items': return pick({ 'flex-start': 'items-start', 'flex-end': 'items-end', center: 'items-center', baseline: 'items-baseline', stretch: 'items-stretch' }, v);
    case 'justify-content': return pick({ 'flex-start': 'justify-start', 'flex-end': 'justify-end', center: 'justify-center', 'space-between': 'justify-between', 'space-around': 'justify-around', 'space-evenly': 'justify-evenly' }, v);
    case 'gap': return p !== null ? [`gap-${spacing(p)}`] : [`gap-[${v}]`];
    case 'width': case 'height': {
      const axis = prop === 'width' ? 'w' : 'h';
      if (v === 'auto') return [];
      if (v === '100%') return [`${axis}-full`];
      if (v === 'max-content') return [`${axis}-max`];
      return p !== null ? [`${axis}-${spacing(p)}`] : [`${axis}-[${v}]`];
    }
    case 'max-width': return v === '100%' ? ['max-w-full'] : p !== null ? [`max-w-[${p}px]`] : [];
    case 'margin': case 'padding': {
      const prefix = prop === 'margin' ? 'm' : 'p';
      const parts = v.split(/\s+/).map((x) => px(x));
      if (parts.every((n): n is number => n !== null)) {
        const [t, r, b, l] = parts;
        if (parts.every((n) => n === parts[0])) return [`${prefix}-${spacing(parts[0])}`];
        if (t === b && r === l) return [`${prefix}-y-${spacing(t)}`, `${prefix}-x-${spacing(r)}`];
        if (r === l) return [`${prefix}-t-${spacing(t)}`, `${prefix}-x-${spacing(r)}`, `${prefix}-b-${spacing(b)}`];
        return [`${prefix}-t-${spacing(t)}`, `${prefix}-r-${spacing(r)}`, `${prefix}-b-${spacing(b)}`, `${prefix}-l-${spacing(l)}`];
      }
      return [`${prefix}-[${v.replace(/\s+/g, '_')}]`];
    }
    case 'font-size': return p !== null ? [`text-[${p}px]`] : [`text-[${v}]`];
    case 'line-height': return [`leading-[${v}]`];
    case 'font-weight': return FONT_WEIGHTS[v] ? [`font-${FONT_WEIGHTS[v]}`] : [];
    case 'text-align': return pick({ left: 'text-left', center: 'text-center', right: 'text-right', justify: 'text-justify' }, v);
    case 'text-transform': return pick({ uppercase: 'uppercase', lowercase: 'lowercase', capitalize: 'capitalize', none: 'normal-case' }, v);
    case 'color': return [`text-${twColor(v)}`];
    case 'background-color': return [`bg-${twColor(v)}`];
    case 'border-radius': {
      if (v === '9999px' || v === '50%') return ['rounded-full'];
      if (p === 4) return ['rounded'];
      if (p === 8) return ['rounded-lg'];
      if (p === 12) return ['rounded-xl'];
      if (p === 16) return ['rounded-2xl'];
      return p !== null ? [`rounded-[${p}px]`] : [];
    }
    case 'box-shadow': return [`shadow-[${v.replace(/,\s*/g, ',').replace(/\s+/g, '_')}]`];
    case 'opacity': return [`opacity-${Math.round(Number.parseFloat(v) * 100)}`];
    case 'overflow': return [`overflow-${v}`];
    case 'letter-spacing': return p !== null ? [`tracking-[${p}px]`] : [];
    case 'white-space': return v === 'nowrap' ? ['whitespace-nowrap'] : [];
    case 'cursor': return pick({ pointer: 'cursor-pointer', default: 'cursor-default' }, v);
    case 'z-index': return [`z-${v}`];
    default: return [];
  }
}

export function tailwindClasses(node: IRNode): string[] {
  const classes: string[] = [];
  for (const [prop, value] of Object.entries(node.styles)) {
    for (const c of toTailwind(prop, value)) {
      if (typeof c === 'string' && c && !classes.includes(c)) classes.push(c);
    }
  }
  return classes;
}
