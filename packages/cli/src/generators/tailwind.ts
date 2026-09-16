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
      const rawParts = v.split(/\s+/);
      const parsedParts = rawParts.map((x) => px(x));
      if (parsedParts.every((n): n is number => n !== null)) {
        let t = 0, r = 0, b = 0, l = 0;
        if (parsedParts.length === 1) { t = r = b = l = parsedParts[0]; }
        else if (parsedParts.length === 2) { t = b = parsedParts[0]; r = l = parsedParts[1]; }
        else if (parsedParts.length === 3) { t = parsedParts[0]; r = l = parsedParts[1]; b = parsedParts[2]; }
        else if (parsedParts.length >= 4) { t = parsedParts[0]; r = parsedParts[1]; b = parsedParts[2]; l = parsedParts[3]; }

        if (t === r && r === b && b === l) return t === 0 ? [] : [`${prefix}-${spacing(t)}`];
        if (t === b && r === l) {
          const res: string[] = [];
          if (t !== 0) res.push(`${prefix}-y-${spacing(t)}`);
          if (r !== 0) res.push(`${prefix}-x-${spacing(r)}`);
          return res;
        }
        const res: string[] = [];
        if (t !== 0) res.push(`${prefix}-t-${spacing(t)}`);
        if (r !== 0) res.push(`${prefix}-r-${spacing(r)}`);
        if (b !== 0) res.push(`${prefix}-b-${spacing(b)}`);
        if (l !== 0) res.push(`${prefix}-l-${spacing(l)}`);
        return res;
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
