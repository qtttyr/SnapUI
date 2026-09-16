import type { CaptureOptions, IRNode } from './types.js';
import { STYLE_PROPS, KEEP_ATTRS, DEFAULT_CAPTURE } from './types.js';

export const EXTRACT_FN_SOURCE = /* js */ `
function __snapuiExtract(rootEl, opts) {
  const PROPS = ${JSON.stringify(STYLE_PROPS)};
  const KEEP = new Set(${JSON.stringify([...KEEP_ATTRS])});
  const maxNodes = opts.maxNodes || ${DEFAULT_CAPTURE.maxNodes};
  const maxDepth = opts.maxDepth || ${DEFAULT_CAPTURE.maxDepth};

  const defaultsCache = new Map();
  const probe = document.createElement('div');
  probe.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden;visibility:hidden;pointer-events:none;';
  document.documentElement.appendChild(probe);

  function getDefaults(tag) {
    if (defaultsCache.has(tag)) return defaultsCache.get(tag);
    try {
      probe.innerHTML = '<' + tag + '></' + tag + '>';
      const el = probe.firstChild;
      if (!el) { defaultsCache.set(tag, null); return null; }
      const cs = getComputedStyle(el);
      const out = {};
      for (const p of PROPS) out[p] = cs.getPropertyValue(p);
      defaultsCache.set(tag, out);
      return out;
    } catch { defaultsCache.set(tag, null); return null; }
  }

  const INHERITED = new Set(['font-family', 'color', 'line-height', 'letter-spacing', 'font-weight', 'text-align', 'white-space']);

  function cleanStyles(el, cs, parentCS) {
    const defaults = getDefaults(el.tagName.toLowerCase());
    const disp = cs.getPropertyValue('display');
    const positioned = cs.getPropertyValue('position');
    const isFlex = disp === 'flex' || disp === 'inline-flex';
    const isGrid = disp === 'grid' || disp === 'inline-grid';
    const NONE_NOISE = { 'filter': 1, 'backdrop-filter': 1, 'box-shadow': 1, 'text-shadow': 1, 'text-transform': 1 };
    const out = {};
    for (const p of PROPS) {
      const v = cs.getPropertyValue(p);
      if (!v || v === 'inherit') continue;
      if (parentCS && INHERITED.has(p) && parentCS.getPropertyValue(p) === v) continue;

      if (v === 'none' && (p === 'transition' || p === 'transform')) continue;
      if (v === 'normal' && (p === 'font-style' || p === 'letter-spacing')) continue;
      if (v === 'rgba(0, 0, 0, 0)' && (p === 'background' || p === 'background-color')) continue;
      if (v === '0' && (p === 'z-index' || p === 'flex-grow' || p === 'flex-shrink')) continue;
      if ((p === 'margin' || p === 'padding') && (v === '0px' || v === '0px 0px' || v === '0px 0px 0px 0px' || v === '0')) continue;
      if (!isFlex && (p === 'flex-direction' || p === 'flex-wrap' || p === 'flex-grow' || p === 'flex-shrink' || p === 'flex-basis' || p === 'align-items' || p === 'align-self' || p === 'justify-content')) continue;
      if (!isFlex && !isGrid && (p === 'row-gap' || p === 'column-gap')) continue;
      if (!isGrid && (p === 'grid-template-columns' || p === 'grid-template-rows')) continue;
      if (positioned === 'static' && (p === 'top' || p === 'right' || p === 'bottom' || p === 'left' || p === 'z-index')) continue;
      if (NONE_NOISE[p] && v === 'none') continue;
      if (p === 'outline' && /\bnone\b/.test(v)) continue;
      if (p === 'border' && (v.indexOf('0px none') === 0 || v.indexOf('0px solid') === 0)) continue;
      if (p === 'transition' && (v === 'all' || v.indexOf('0s') !== -1)) continue;
      if (p === 'object-fit' && v === 'fill') continue;
      if (p === 'aspect-ratio' && v === 'auto') continue;
      if (p === 'white-space' && v === 'normal') continue;
      if (p === 'position' && v === 'static') continue;
      if (p === 'z-index' && v === 'auto') continue;
      if (p === 'opacity' && v === '1') continue;
      if (p === 'font-weight' && v === '400') continue;
      if (p === 'text-align' && (v === 'start' || v === 'left')) continue;
      if (p === 'cursor' && (v === 'auto' || v === 'default')) continue;
      if ((p === 'width' || p === 'height') && v === 'auto') continue;
      // Do not emit calculated pixel width/height for text & flow elements unless explicitly styled or positioned/replaced.
      const tag = el.tagName.toLowerCase();
      const isReplaced = ['img', 'svg', 'video', 'canvas', 'input', 'iframe', 'button'].includes(tag);
      const isPositioned = positioned === 'absolute' || positioned === 'fixed';
      const hasInlineSize = el.style && (el.style.width || el.style.height);
      const isFlowText = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'span', 'b', 'i', 'strong', 'em', 'a', 'label'].includes(tag);
      if ((p === 'width' || p === 'height') && (isFlowText || (!isReplaced && !isPositioned && !hasInlineSize))) continue;

      if ((p === 'min-width' || p === 'min-height') && v === '0px') continue;
      if ((p === 'max-width' || p === 'max-height') && (v === 'none' || v === '0px')) continue;
      if (p === 'background-image' && v === 'none') continue;
      if (p === 'background-size' && v === 'auto') continue;
      if (p === 'background-position' && v === '0% 0%') continue;
      if (p === 'background-repeat' && v === 'repeat') continue;
      if (defaults && defaults[p] === v) continue;
      out[p] = v;
    }
    return out;
  }

  function cleanAttrs(el) {
    const out = {};
    for (const a of el.attributes || []) {
      if (!KEEP.has(a.name)) continue;
      if (a.name === 'class' || a.name === 'style' || a.name === 'id') continue;
      out[a.name] = a.value;
    }
    return out;
  }

  const images = [];
  let count = 0;

  function walk(el, depth, parentCS) {
    if (count >= maxNodes || depth > maxDepth) return null;
    count++;

    const tag = el.tagName.toLowerCase();
    if (tag === 'script' || tag === 'style' || tag === 'noscript' || tag === 'link' || tag === 'meta') return null;

    const cs = getComputedStyle(el);
    const node = { tag, attrs: cleanAttrs(el), styles: cleanStyles(el, cs, parentCS), children: [] };

    if (tag === 'img' && el.getAttribute('src')) images.push(el.src);

    if (el.namespaceURI && el.namespaceURI.includes('svg') && el !== rootEl) {
      node.tag = '#svg';
      node.text = el.outerHTML.replace(/\sdata-[a-zA-Z0-9_-]+(="[^"]*")?/g, '');
      return node;
    }

    if (el.childNodes.length) {
      const parts = [];
      for (const n of el.childNodes) {
        if (n.nodeType === Node.TEXT_NODE) {
          const t = (n.textContent || '').replace(/\\s+/g, ' ');
          if (t.trim()) parts.push(t.trim());
        }
      }
      if (parts.length) node.text = parts.join(' ').slice(0, 500);
    }

    for (const child of el.children) {
      const c = walk(child, depth + 1, cs);
      if (c) node.children.push(c);
      if (count >= maxNodes) break;
    }
    return node;
  }

  const root = walk(rootEl, 0, null);
  if (!root) return null;

  const JUNK_RE = /^(astro-[a-z0-9]+|jsx-\\d+|css-[a-z0-9]+|s-[a-z0-9]+|data-v-[a-z0-9]+|ng-[a-z0-9]+|sc-[a-zA-Z0-9]+|__[a-z0-9_-]+|\\d+|[0-9a-f]{6,})$/i;
  const rawClasses = (typeof rootEl.className === 'string') ? rootEl.className.trim().split(/\\s+/).filter(Boolean) : [];
  const cleanClasses = rawClasses.filter((c) => !JUNK_RE.test(c) && /^[a-zA-Z][\\w-]*$/.test(c));

  const hint = {
    tag: rootEl.tagName.toLowerCase(),
    classes: cleanClasses.slice(0, 3),
    id: rootEl.id || undefined,
    textSample: (rootEl.textContent || '').replace(/[^\\x20-\\x7E\\u0400-\\u04FF]/g, ' ').replace(/\\s+/g, ' ').trim().slice(0, 50),
  };

  return { root, assets: { images: [...new Set(images)] }, hint };
}
`;
