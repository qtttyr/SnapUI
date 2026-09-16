export const PANEL_SOURCE = /* js */ `
(() => {
  if (window.__snapuiPanelState) { window.__snapuiPanelShow(true); return; }

  const PANEL_W = 420;
  const css = ''
    + '@keyframes snp-in{from{opacity:0;transform:translateX(100%)}to{opacity:1;transform:none}}'
    + '@keyframes snp-pop{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}'
    + '@keyframes snp-pulse{0%,100%{opacity:.35;transform:scale(0.92)}50%{opacity:1;transform:scale(1.08)}}'
    + '.snp{position:fixed;top:16px;right:16px;bottom:16px;width:' + PANEL_W + 'px;height:calc(100vh - 32px);max-height:860px;z-index:2147483647;'
    + 'background:rgba(10,11,16,.94);backdrop-filter:blur(28px) saturate(190%);'
    + 'border:1px solid rgba(255,255,255,.12);border-radius:20px;box-shadow:0 24px 80px rgba(0,0,0,.7),0 0 0 1px rgba(255,77,0,.2);'
    + 'color:#f4f1ea;font:13px/1.5 ui-monospace,SFMono-Regular,Menlo,Monaco,monospace;'
    + 'display:flex;flex-direction:column;opacity:1;transform:translateX(0) scale(1);'
    + 'transition:transform .4s cubic-bezier(.16,1,.3,1),opacity .35s ease;will-change:transform,opacity}'
    + '.snp.min{transform:translateX(480px) scale(0.92);opacity:0;pointer-events:none}'
    + '.snp *{box-sizing:border-box;margin:0;padding:0}'
    + '.snp-head{display:flex;align-items:center;gap:12px;padding:16px 20px;border-bottom:1px solid rgba(255,255,255,.08);background:rgba(18,20,28,.6);flex:none;border-radius:20px 20px 0 0}'
    + '.snp-logo{width:28px;height:28px;border-radius:8px;display:grid;place-items:center;'
    + 'background:linear-gradient(135deg,#ff4d00,#e03e00);font-weight:800;font-size:16px;color:#fff;'
    + 'box-shadow:0 4px 16px rgba(255,77,0,.45)}'
    + '.snp-title{font-weight:800;font-size:14px;letter-spacing:-.02em;color:#f4f1ea}'
    + '.snp-title small{display:block;font-weight:600;font-size:10px;color:#ff4d00;letter-spacing:.12em;text-transform:uppercase;margin-top:1px}'
    + '.snp-min{margin-left:auto;width:28px;height:28px;border-radius:8px;border:1px solid rgba(255,255,255,.12);'
    + 'background:rgba(255,255,255,.04);color:#a0a3b8;cursor:pointer;font-size:14px;line-height:1;transition:all .18s}'
    + '.snp-min:hover{background:rgba(255,77,0,.25);border-color:rgba(255,77,0,.5);color:#fff;transform:scale(1.06)}'
    + '.snp-body{flex:1;overflow-y:auto;padding:20px;scrollbar-width:thin;scrollbar-color:rgba(255,77,0,.4) transparent}'
    + '.snp-body::-webkit-scrollbar{width:5px}.snp-body::-webkit-scrollbar-thumb{background:rgba(255,77,0,.35);border-radius:99px}'
    + '.snp-sec{animation:snp-pop .32s cubic-bezier(.16,1,.3,1) both}'
    + '.snp-status{display:flex;align-items:center;gap:12px;padding:14px 16px;border-radius:12px;'
    + 'background:rgba(255,77,0,.06);border:1px solid rgba(255,77,0,.25);margin-bottom:16px}'
    + '.snp-dot{width:9px;height:9px;border-radius:50%;background:#ff4d00;animation:snp-pulse 1.6s infinite;flex:none}'
    + '.snp-dot.ok{background:#4ade80;animation:none;box-shadow:0 0 10px rgba(74,222,128,.5)}'
    + '.snp-dot.err{background:#f87171;animation:none}'
    + '.snp-status b{font-weight:700;font-size:13px;color:#fff}'
    + '.snp-status small{display:block;color:#a0a3b8;font-size:11.5px;margin-top:2px}'
    + '.snp-spec{background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);border-radius:14px;padding:16px;margin-bottom:16px}'
    + '.snp-spec-head{font-size:10px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#ff4d00;margin-bottom:12px;display:flex;align-items:center;justify-content:space-between}'
    + '.snp-kv{display:flex;flex-direction:column;gap:6px;font:12px/1.7 ui-monospace,Monaco,monospace}'
    + '.snp-kv-row{display:flex;gap:12px}'
    + '.snp-kv-row span:first-child{color:#8b8fa3;min-width:60px;flex:none;text-transform:uppercase;font-size:10.5px;letter-spacing:.05em}'
    + '.snp-kv-row span:last-child{color:#ffe5d9;word-break:break-all;font-weight:600}'
    + '.snp-label{font-size:10.5px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:#8b8fa3;margin:18px 0 8px;display:flex;align-items:center;gap:6px}'
    + '.snp-label::before{content:"";width:12px;height:1px;background:#ff4d00}'
    + '.snp-input{width:100%;padding:11px 14px;border-radius:10px;border:1px solid rgba(255,255,255,.14);'
    + 'background:rgba(0,0,0,.45);color:#fff;font:600 13px ui-monospace,Monaco,monospace;outline:none;transition:all .18s}'
    + '.snp-input:focus{border-color:#ff4d00;box-shadow:0 0 0 3px rgba(255,77,0,.22)}'
    + '.snp-seg{display:flex;gap:6px;flex-wrap:wrap}'
    + '.snp-seg button{flex:1;min-width:76px;padding:9px 6px;border-radius:10px;border:1px solid rgba(255,255,255,.1);'
    + 'background:rgba(255,255,255,.03);color:#a0a3b8;font-size:12px;font-weight:700;cursor:pointer;transition:all .18s}'
    + '.snp-seg button:hover{border-color:rgba(255,77,0,.4);color:#fff;transform:translateY(-1px)}'
    + '.snp-seg button.on{background:rgba(255,77,0,.18);border-color:#ff4d00;color:#fff;box-shadow:0 2px 14px rgba(255,77,0,.3)}'
    + '.snp-check{display:flex;align-items:center;gap:10px;margin-top:16px;font-size:12.5px;color:#a0a3b8;cursor:pointer;user-select:none}'
    + '.snp-check input{accent-color:#ff4d00;width:15px;height:15px}'
    + '.snp-btn{width:100%;padding:13px;border-radius:12px;border:none;cursor:pointer;margin-top:20px;'
    + 'font-size:13.5px;font-weight:800;letter-spacing:.02em;transition:all .2s cubic-bezier(.16,1,.3,1)}'
    + '.snp-btn.primary{background:linear-gradient(135deg,#ff4d00,#e03e00);color:#fff;box-shadow:0 6px 24px rgba(255,77,0,.4)}'
    + '.snp-btn.primary:hover:not([disabled]){transform:translateY(-2px);box-shadow:0 10px 30px rgba(255,77,0,.6)}'
    + '.snp-btn.primary:active{transform:translateY(0)}'
    + '.snp-btn.primary[disabled]{opacity:.6;cursor:wait}'
    + '.snp-btn.ghost{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);color:#ffe5d9;font-weight:700}'
    + '.snp-btn.ghost:hover{border-color:rgba(255,77,0,.5);background:rgba(255,77,0,.12);color:#fff;transform:translateY(-1px)}'
    + '.snp-err{background:rgba(248,113,113,.1);border:1px solid rgba(248,113,113,.4);color:#fca5a5;'
    + 'border-radius:12px;padding:12px 14px;font-size:12px;margin-bottom:14px;word-break:break-word}'
    + '.snp-tabs{display:flex;gap:6px;margin-bottom:12px;flex-wrap:wrap}'
    + '.snp-tabs button{padding:7px 12px;border-radius:8px;border:1px solid rgba(255,255,255,.08);background:rgba(255,255,255,.03);'
    + 'color:#8b8fa3;font:700 11.5px ui-monospace,Monaco,monospace;cursor:pointer;transition:all .18s}'
    + '.snp-tabs button:hover{color:#fff;border-color:rgba(255,77,0,.4)}'
    + '.snp-tabs button.on{color:#fff;background:rgba(255,77,0,.18);border-color:#ff4d00;box-shadow:0 2px 10px rgba(255,77,0,.25)}'
    + '.snp-code{position:relative;background:#08090d;border:1px solid rgba(255,255,255,.1);border-radius:12px;overflow:hidden}'
    + '.snp-code pre{margin:0;padding:16px;overflow:auto;max-height:48vh;font:12px/1.7 ui-monospace,SFMono-Regular,Monaco,monospace;color:#e2e8f0;scrollbar-width:thin}'
    + '.snp-code pre::-webkit-scrollbar{width:6px;height:6px}.snp-code pre::-webkit-scrollbar-thumb{background:rgba(255,77,0,.4);border-radius:99px}'
    + '.snp-cp{position:absolute;top:10px;right:10px;padding:6px 14px;border-radius:8px;border:1px solid rgba(255,77,0,.5);'
    + 'background:rgba(12,13,18,.92);color:#ff4d00;font:700 11px ui-monospace,sans-serif;cursor:pointer;transition:all .18s;z-index:2}'
    + '.snp-cp:hover{background:#ff4d00;color:#fff;box-shadow:0 4px 14px rgba(255,77,0,.4)}'
    + '.snp-cp.done{color:#4ade80;border-color:rgba(74,222,128,.6);background:rgba(10,125,75,.2)}'
    + '.snp-path{margin-top:12px;font:11px ui-monospace,Monaco,monospace;color:#8b8fa3;word-break:break-all}'
    + '.snp-path b{color:#ff4d00}'
    + '.snp-tok-k{color:#ffb38a}.snp-tok-s{color:#86efac}.snp-tok-c{color:#5b5f73;font-style:italic}'
    + '.snp-tok-t{color:#ffd6a5}.snp-tok-n{color:#fbbf24}.snp-tok-p{color:#ffe5d9}'
    + '.snp-foot{flex:none;padding:12px 20px;border-top:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;font-size:11px;color:#8b8fa3;background:rgba(18,20,28,.4);border-radius:0 0 20px 20px}'
    + '.snp-foot span{display:flex;align-items:center;gap:6px}'
    + '.snp-fab{position:fixed;right:20px;bottom:20px;z-index:2147483646;display:none;align-items:center;gap:10px;'
    + 'padding:12px 22px;border-radius:999px;border:1.5px solid rgba(255,77,0,.5);cursor:pointer;'
    + 'background:rgba(12,14,20,.92);backdrop-filter:blur(16px);color:#fff;font:700 13px ui-monospace,sans-serif;'
    + 'box-shadow:0 10px 36px rgba(0,0,0,.6),0 0 20px rgba(255,77,0,.25);transition:all .25s cubic-bezier(.16,1,.3,1)}'
    + '.snp-fab:hover{transform:translateY(-3px) scale(1.04);background:#ff4d00;box-shadow:0 14px 40px rgba(255,77,0,.5)}'
  ;
  const style = document.createElement('style');
  style.id = '__snapui_style';
  style.textContent = css;
  (document.head || document.documentElement).appendChild(style);

  const panel = document.createElement('div');
  panel.className = 'snp';
  panel.innerHTML =
    '<div class="snp-head">'
    + '<div class="snp-logo">⬒</div>'
    + '<div class="snp-title">SnapUI<small id="snp-phase">SPEC // Picking…</small></div>'
    + '<button class="snp-min" id="snp-min" title="Collapse">−</button>'
    + '</div>'
    + '<div class="snp-body" id="snp-body"></div>'
    + '<div class="snp-foot"><span><b style="color:#ff4d00">⬒ SnapUI</b> · live DOM component compiler</span><span>v0.1</span></div>';
  (document.body || document.documentElement).appendChild(panel);

  const fab = document.createElement('button');
  fab.className = 'snp-fab';
  fab.id = 'snp-fab';
  fab.innerHTML = '<span style="font-size:15px">⬒</span> SnapUI Panel';
  document.documentElement.appendChild(fab);

  const el = (id) => document.getElementById(id);
  const esc = (s) => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const escAttr = (s) => esc(s).replace(/\\n/g, '&#10;');

  // ---- state -----------------------------------------------------------
  const st = {
    phase: 'picking',
    hint: null,
    suggestion: '',
    framework: 'react',
    style: 'css',
    saveStorybook: true,
    error: null,
    files: [],
    outDir: '.',
  };

  const FRAMEWORKS = [
    { id: 'react', label: 'React TSX' },
    { id: 'vue', label: 'Vue SFC' },
    { id: 'svelte', label: 'Svelte' },
    { id: 'html', label: 'HTML' },
  ];
  const STYLES = [
    { id: 'css', label: 'CSS' },
    { id: 'tailwind', label: 'Tailwind' },
    { id: 'modules', label: 'Modules' },
  ];

  function setPhase(phase, opts) {
    Object.assign(st, opts || {});
    st.phase = phase;
    if (st.phase === 'picking') {
      panel.classList.add('min');
      fab.style.display = 'flex';
    } else {
      panel.classList.remove('min');
      fab.style.display = 'none';
    }
    render();
  }
  window.__snapuiPanelState = (s) => setPhase(s.phase, s);

  // ---- tiny syntax highlighter ----------------------------------------
  function highlight(code, lang) {
    let h = esc(code);
    if (lang === 'css') {
      h = h.replace(/(\\/\\*[\\s\\S]*?\\*\\/)/g, '\\u0001C$1\\u0002');
      h = h.replace(/^([^\\n{}/]*)(\\{)/gm, '\\u0001S$1\\u0002\\u0001P$2\\u0002');
      h = h.replace(/^([\\s]+)([a-z-]+)(\\s*:.*)$/gm, (m, sp, p, rest) =>
        sp + '\\u0001S' + p + '\\u0002' + rest);
      h = h.replace(/^([^\\n{}]*)(:)/gm, (m, a, b) =>
        a.includes('\\u0001') ? m : '\\u0001K' + a + '\\u0002' + b);
      h = h.replace(/(#[0-9a-fA-F]{3,8}\\b|rgba?\\([^)]*\\)|\\b\\d+(?:\\.\\d+)?(?:px|em|rem|%|s|vh|vw)?\\b)/g, '\\u0001N$1\\u0002');
    } else {
      h = h.replace(/(&lt;!--[\\s\\S]*?--&gt;)/g, '\\u0001C$1\\u0002');
      h = h.replace(/(\\/\\*[\\s\\S]*?\\*\\/)/g, '\\u0001C$1\\u0002');
      h = h.replace(/(&quot;[^&]*?&quot;|'[^']*?')/g, '\\u0001S$1\\u0002');
      h = h.replace(/(&lt;\\/?)([a-zA-Z][\\w-]*)/g, '$1\\u0001T$2\\u0002');
      h = h.replace(/\\b(import|export|from|function|return|const|interface|class|style)\\b/g, '\\u0001K$1\\u0002');
    }
    return h
      .replace(/\\u0001K/g, '<span class="snp-tok-k">')
      .replace(/\\u0001S/g, '<span class="snp-tok-s">')
      .replace(/\\u0001C/g, '<span class="snp-tok-c">')
      .replace(/\\u0001T/g, '<span class="snp-tok-t">')
      .replace(/\\u0001N/g, '<span class="snp-tok-n">')
      .replace(/\\u0001P/g, '<span class="snp-tok-p">')
      .replace(/\\u0002/g, '</span>');
  }

  // ---- actions ---------------------------------------------------------
  const act = (a) => window.__snapuiPanelAction && window.__snapuiPanelAction(JSON.stringify(a));

  const PHASE_LABEL = {
    picking: 'SPEC // Picking…', configuring: 'SPEC // Configure', generating: 'SPEC // Generating…',
    generated: 'SPEC // Complete ✨', error: 'SPEC // Error', cancelled: 'SPEC // Cancelled',
  };

  function render() {
    el('snp-phase').textContent = PHASE_LABEL[st.phase] || st.phase;
    const body = el('snp-body');
    let h = '';

    if (st.error) h += '<div class="snp-err">' + esc(st.error) + '</div>';

    if (st.phase === 'picking') {
      h += '<div class="snp-sec"><div class="snp-status">'
        + '<div class="snp-dot"></div><div><b>Hover & click element</b>'
        + '<small>Point any UI element in the browser — Esc to cancel.</small>'
        + '</div></div></div>';
    }

    if (st.hint) {
      const hi = st.hint;
      const JUNK_HASH = /^(astro-[a-z0-9]+|jsx-\d+|css-[a-z0-9]+|s-[a-z0-9]+|data-v-[a-z0-9]+|ng-[a-z0-9]+|sc-[a-zA-Z0-9]+)$/i;
      const cleanClasses = (hi.classes || []).filter((c) => c && !JUNK_HASH.test(c));
      h += '<div class="snp-sec snp-spec"><div class="snp-spec-head"><span>TARGET // CAPTURED</span><span style="background:rgba(255,77,0,.15);color:#ff4d00;padding:2px 8px;border-radius:6px;font-weight:800;border:1px solid rgba(255,77,0,.3)">&lt;' + esc(hi.tag.toUpperCase()) + '&gt;</span></div><div class="snp-kv">'
        + (cleanClasses.length ? '<div class="snp-kv-row"><span>CLASS</span><span>' + esc(cleanClasses.map((c) => '.' + c).join(' ')) + '</span></div>' : '')
        + (hi.id ? '<div class="snp-kv-row"><span>ID</span><span>#' + esc(hi.id) + '</span></div>' : '')
        + (hi.nodes ? '<div class="snp-kv-row"><span>NODES</span><span>' + esc(hi.nodes) + ' DOM elements</span></div>' : '')
        + (hi.textSample ? '<div class="snp-kv-row"><span>TEXT</span><span>"' + esc(hi.textSample.slice(0, 45)) + '"</span></div>' : '')
        + '</div></div>';
    }

    if (['configuring', 'generating', 'generated', 'error'].includes(st.phase)) {
      h += '<div class="snp-sec">'
        + '<div class="snp-label">Component name</div>'
        + '<input class="snp-input" id="snp-name" value="' + escAttr(st.suggestion || '') + '" spellcheck="false" />'
        + '<div class="snp-label">Target Framework</div><div class="snp-seg" id="snp-fw">'
        + FRAMEWORKS.map((f) => '<button data-v="' + f.id + '"' + (st.framework === f.id ? ' class="on"' : '') + '>' + f.label + '</button>').join('')
        + '</div>'
        + '<div class="snp-label">Styling Engine</div><div class="snp-seg" id="snp-style">'
        + STYLES.map((f) => '<button data-v="' + f.id + '"' + (st.style === f.id ? ' class="on"' : '') + '>' + f.label + '</button>').join('')
        + '</div>'
        + '<label class="snp-check"><input type="checkbox" id="snp-story"' + (st.saveStorybook ? ' checked' : '') + ' /> Include Storybook (.stories.tsx)</label>'
        + '<button class="snp-btn primary" id="snp-gen"' + (st.phase === 'generating' ? ' disabled' : '') + '>'
        + (st.phase === 'generating' ? 'Generating Component…' : 'Generate Component ✨')
        + '</button></div>';
    }

    if (st.phase === 'generated') {
      h += '<div class="snp-sec" style="margin-top:16px"><div class="snp-status">'
        + '<div class="snp-dot ok"></div><div><b>' + (st.files || []).length + ' component file(s) generated ✨</b>'
        + '<small>' + esc(st.outDir || '.') + '</small></div></div>';
      h += '<div class="snp-tabs" id="snp-tabs">'
        + (st.files || []).map((f, i) => '<button data-i="' + i + '"' + (i === 0 ? ' class="on"' : '') + '>' + esc(f.path.split('/').pop()) + '</button>').join('')
        + '</div>';
      const first = (st.files || [])[0];
      h += '<div class="snp-code"><button class="snp-cp" id="snp-copy">Copy</button>'
        + '<pre id="snp-code-pre"><code>' + highlight(first ? first.content : '', guessLang(first)) + '</code></pre></div>';
      h += '<div class="snp-path">written to <b>' + esc(st.outDir || '.') + '</b></div>';
      h += '<button class="snp-btn ghost" id="snp-again">↺ Capture another element</button></div>';
    }

    if (st.phase === 'cancelled') {
      h += '<div class="snp-sec"><div class="snp-status"><div class="snp-dot"></div>'
        + '<div><b>Capture Cancelled</b><small>Hover and click any element to capture again.</small></div></div></div>';
    }

    body.innerHTML = h;
    body.scrollTop = 0;
    wire();
  }

  function guessLang(file) {
    if (!file) return 'tsx';
    if (file.path.endsWith('.css')) return 'css';
    return 'tsx';
  }

  function wire() {
    const fw = el('snp-fw');
    if (fw) fw.onclick = (e) => { const b = e.target.closest('button'); if (b) { st.framework = b.dataset.v; render(); } };
    const sy = el('snp-style');
    if (sy) sy.onclick = (e) => { const b = e.target.closest('button'); if (b) { st.style = b.dataset.v; render(); } };
    const gen = el('snp-gen');
    if (gen) gen.onclick = () => {
      gen.disabled = true; gen.textContent = 'Generating…';
      act({ type: 'generate', name: (el('snp-name') || {}).value || st.suggestion || 'Component',
            framework: st.framework, style: st.style, storybook: !!(el('snp-story') || {}).checked });
    };
    const story = el('snp-story');
    if (story) story.onchange = () => { st.saveStorybook = story.checked; };
    const cp = el('snp-copy');
    if (cp) cp.onclick = () => {
      const on = el('snp-tabs') && el('snp-tabs').querySelector('.on');
      const idx = on ? Number(on.dataset.i) : 0;
      navigator.clipboard.writeText((st.files[idx] || {}).content || '').then(() => {
        cp.textContent = 'Copied ✓'; cp.classList.add('done');
        setTimeout(() => { cp.textContent = 'Copy'; cp.classList.remove('done'); }, 1400);
      });
    };
    const tabs = el('snp-tabs');
    if (tabs) tabs.onclick = (e) => {
      const b = e.target.closest('button'); if (!b) return;
      tabs.querySelectorAll('button').forEach((x) => x.classList.toggle('on', x === b));
      const f = st.files[Number(b.dataset.i)];
      el('snp-code-pre').innerHTML = '<code>' + highlight(f.content, guessLang(f)) + '</code>';
    };
    const again = el('snp-again');
    if (again) again.onclick = () => act({ type: 'again' });
    const min = el('snp-min');
    if (min) min.onclick = () => {
      const collapsed = panel.classList.toggle('min');
      min.textContent = collapsed ? '⬒' : '−';
      fab.style.display = collapsed ? 'flex' : 'none';
    };
    fab.onclick = () => {
      panel.classList.remove('min'); fab.style.display = 'none'; min.textContent = '−';
    };
  }

  window.__snapuiPanelState = window.__snapuiPanelState || ((s) => { Object.assign(st, s); render(); });
  window.__snapuiPanelShow = (show) => { panel.style.display = show ? 'flex' : 'none'; if (!show) fab.style.display = 'none'; };

  render();
})();
`;
