export const OVERLAY_SOURCE = /* js */ `
(() => {
  if (window.__snapuiPick) return;

  const state = { hovered: null, done: false };

  const box = document.createElement('div');
  box.id = '__snapui_box';
  Object.assign(box.style, {
    position: 'fixed', zIndex: 2147483646, pointerEvents: 'none',
    border: '2px solid #ff4d00', borderRadius: '6px',
    boxShadow: '0 0 0 9999px rgba(255,77,0,0.08), 0 8px 30px rgba(255,77,0,0.35)',
    transition: 'all 60ms ease-out', display: 'none',
  });

  const label = document.createElement('div');
  label.id = '__snapui_label';
  Object.assign(label.style, {
    position: 'fixed', zIndex: 2147483647, pointerEvents: 'none',
    background: 'linear-gradient(135deg,#ff4d00,#e03e00)', color: '#fff',
    font: '700 12px/1.4 ui-monospace,SFMono-Regular,Monaco,monospace',
    padding: '4px 10px', borderRadius: '6px',
    boxShadow: '0 4px 16px rgba(255,77,0,0.4)', display: 'none', whiteSpace: 'nowrap',
  });

  const hint = document.createElement('div');
  hint.id = '__snapui_hint';
  hint.innerHTML = '<b style="color:#ff4d00">⬒ SnapUI</b> — click to capture · <b style="color:#a0a3b8">Esc</b> to cancel';
  Object.assign(hint.style, {
    position: 'fixed', zIndex: 2147483647, pointerEvents: 'none',
    bottom: '24px', left: '50%', transform: 'translateX(-50%)',
    background: 'rgba(12,13,18,0.92)', color: '#f4f1ea',
    font: '600 13px/1.4 ui-monospace,SFMono-Regular,-apple-system,sans-serif',
    padding: '10px 20px', borderRadius: '999px',
    border: '1px solid rgba(255,77,0,0.4)',
    boxShadow: '0 10px 40px rgba(0,0,0,0.65)',
    backdropFilter: 'blur(16px)',
  });

  function describe(el) {
    const tag = el.tagName.toLowerCase();
    const cls = (typeof el.className === 'string' && el.className.trim())
      ? '.' + el.className.trim().split(/\\s+/).slice(0, 3).join('.') : '';
    const id = el.id ? '#' + el.id : '';
    return tag + id + cls;
  }

  function positionBox(el) {
    const r = el.getBoundingClientRect();
    box.style.display = 'block';
    box.style.top = r.top + 'px';
    box.style.left = r.left + 'px';
    box.style.width = r.width + 'px';
    box.style.height = r.height + 'px';
    label.style.display = 'block';
    label.textContent = describe(el);
    const ly = r.top - 26 < 8 ? r.bottom + 8 : r.top - 26;
    label.style.top = ly + 'px';
    label.style.left = Math.max(8, r.left) + 'px';
  }

  function isSnapUIElement(el) {
    if (!el) return false;
    return !!(el.closest && (el.closest('.snp') || el.closest('.snp-fab') || el.closest('#__snapui_box') || el.closest('#__snapui_label') || el.closest('#__snapui_hint')) || (el.id && el.id.startsWith('__snapui')));
  }

  function onMouseMove(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!el || isSnapUIElement(el) || el === box || el === label || el === hint || box.contains(el)) return;
    state.hovered = el;
    positionBox(el);
  }

  function onClick(e) {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (isSnapUIElement(el)) return;
    e.preventDefault(); e.stopPropagation();
    if (state.hovered) finish(state.hovered);
  }

  function onKey(e) {
    if (e.key === 'Escape') { e.preventDefault(); finish(null); }
  }

  function cleanup() {
    document.removeEventListener('mousemove', onMouseMove, true);
    document.removeEventListener('click', onClick, true);
    document.removeEventListener('keydown', onKey, true);
    box.remove(); label.remove(); hint.remove();
  }

  function finish(el) {
    if (state.done) return;
    state.done = true;
    cleanup();
    window.__snapuiPickedEl = el || null;
    const resolve = window.__snapuiPick.resolve;
    delete window.__snapuiPick;
    resolve(el ? '__snapui-picked' : null);
  }

  document.addEventListener('mousemove', onMouseMove, true);
  document.addEventListener('click', onClick, true);
  document.addEventListener('keydown', onKey, true);
  document.documentElement.append(box, label, hint);

  window.__snapuiPick = { promise: null, resolve: null };
  window.__snapuiPick.promise = new Promise((res) => { window.__snapuiPick.resolve = res; });
})();
`;
