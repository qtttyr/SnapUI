'use client';

import { useLayoutEffect, useRef, useState } from 'react';

/* Interactive playground: hover a mock element → pick frame + selector label.
   Click → pins it and the code panel types the generated component. */

type Pick = {
  id: string;
  label: string;
  file: string;
  lines: { text: string; cls: string }[];
};

const PICKS: Record<string, Pick> = {
  nav: {
    id: 'nav',
    label: 'header.site-header',
    file: 'components/SiteHeader.tsx',
    lines: [
      { text: '<header className="site-header">', cls: 'tag' },
      { text: '  <span className="site-header__logo">Nord</span>', cls: 'text' },
      { text: '  <nav className="site-header__nav">', cls: 'tag' },
      { text: '    <a href="/docs">Docs</a>', cls: 'text' },
      { text: '    <a href="/pricing">Pricing</a>', cls: 'text' },
      { text: '  </nav>', cls: 'tag' },
      { text: '</header>', cls: 'tag' },
    ],
  },
  btn: {
    id: 'btn',
    label: 'button.btn-primary · 128×40',
    file: 'components/PrimaryButton.tsx',
    lines: [
      { text: 'export default function PrimaryButton() {', cls: '' },
      { text: '  return (', cls: 'punc' },
      { text: '    <button className="btn-primary">', cls: 'tag' },
      { text: '      Start free trial', cls: 'text' },
      { text: '    </button>', cls: 'tag' },
      { text: '  );', cls: 'punc' },
      { text: '}', cls: '' },
    ],
  },
  card: {
    id: 'card',
    label: 'div.pricing-card',
    file: 'components/PricingCard.tsx',
    lines: [
      { text: '<article className="pricing-card">', cls: 'tag' },
      { text: '  <h3 className="pricing-card__title">Pro</h3>', cls: 'text' },
      { text: '  <p className="pricing-card__price">$12/mo</p>', cls: 'text' },
      { text: '  <button className="pricing-card__cta">Buy</button>', cls: 'tag' },
      { text: '</article>', cls: 'tag' },
    ],
  },
  input: {
    id: 'input',
    label: 'input.email-field · 240×36',
    file: 'components/EmailField.tsx',
    lines: [
      { text: '<label className="email-field">', cls: 'tag' },
      { text: '  <span className="email-field__hint">Work email</span>', cls: 'text' },
      { text: '  <input', cls: 'tag' },
      { text: '    type="email"', cls: 'attr' },
      { text: '    placeholder="you@company.com"', cls: 'attr' },
      { text: '  />', cls: 'tag' },
      { text: '</label>', cls: 'tag' },
    ],
  },
};

export default function Playground() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [pinned, setPinned] = useState<string | null>(null);
  const [typed, setTyped] = useState(Infinity);
  const siteRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  const active = hovered ?? pinned;
  const pick = active ? PICKS[active] : null;
  const total = pick ? pick.lines.reduce((n, l) => n + l.text.length, 0) : 0;

  // reset typewriter when a new element is pinned
  const lastPinned = useRef<string | null>(null);
  if (pinned !== lastPinned.current) {
    lastPinned.current = pinned;
    if (pinned) setTyped(0);
  }

  // typewriter
  useLayoutEffect(() => {
    if (!pinned || typed >= total) return;
    const iv = setInterval(() => setTyped((n) => n + 1), 12);
    return () => clearInterval(iv);
  }, [pinned, typed, total]);

  // position the pick frame over the active element
  useLayoutEffect(() => {
    const site = siteRef.current, box = boxRef.current;
    if (!site || !box) return;
    const el = active ? site.querySelector<HTMLElement>(`[data-pick="${active}"]`) : null;
    if (!el) { box.classList.remove('show'); return; }
    const sb = site.getBoundingClientRect(), eb = el.getBoundingClientRect();
    box.style.left = `${eb.left - sb.left - 6}px`;
    box.style.top = `${eb.top - sb.top - 6}px`;
    box.style.width = `${eb.width + 12}px`;
    box.style.height = `${eb.height + 12}px`;
    box.classList.add('show');
    if (labelRef.current) {
      labelRef.current.textContent = PICKS[active!].label;
      labelRef.current.parentElement!.classList.toggle('below', eb.top - sb.top < 34);
    }
  }, [active]);

  let remaining = typed;
  const lines = pick ? pick.lines.map((l) => {
    const shown = l.text.slice(0, Math.max(0, remaining));
    remaining -= l.text.length;
    return { shown, cls: l.cls };
  }) : [];
  const lastIdx = typed < total
    ? lines.findIndex((l, i) => l.shown.length > 0 && l.shown.length < pick!.lines[i].text.length)
    : -1;

  return (
    <div className="pg-frame">
      <div className="pg-hint-row">
        <span className="pg-hint"><span className="pg-dot" /> Hover the mock — <b>click to pin</b> &amp; see the code</span>
        {pinned && (
          <button className="pg-reset" onClick={() => { setPinned(null); setHovered(null); setTyped(Infinity); }}>reset ✕</button>
        )}
      </div>
      <div className="pg-body">
        <div className="pg-site" ref={siteRef}>
          <div
            data-pick="nav"
            className={`pg-el pg-nav ${active === 'nav' ? 'active' : ''}`}
            onMouseEnter={() => setHovered('nav')}
            onMouseLeave={() => setHovered(null)}
            onClick={() => setPinned('nav')}
          >
            <span className="pg-logo">Nord</span>
            <span className="pg-links"><i /><i /><i /></span>
          </div>

          <div className="pg-hero">
            <div
              data-pick="card"
              className={`pg-el pg-card ${active === 'card' ? 'active' : ''}`}
              onMouseEnter={() => setHovered('card')}
              onMouseLeave={() => setHovered(null)}
              onClick={() => setPinned('card')}
            >
              <span className="pg-tier">Pro</span>
              <span className="pg-price">$12<span>/mo</span></span>
              <span className="pg-perk" /><span className="pg-perk" /><span className="pg-perk short" />
            </div>

            <div className="pg-side">
              <div
                data-pick="btn"
                className={`pg-el pg-btn ${active === 'btn' ? 'active' : ''}`}
                onMouseEnter={() => setHovered('btn')}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setPinned('btn')}
              >
                Start free trial
              </div>
              <div
                data-pick="input"
                className={`pg-el pg-input ${active === 'input' ? 'active' : ''}`}
                onMouseEnter={() => setHovered('input')}
                onMouseLeave={() => setHovered(null)}
                onClick={() => setPinned('input')}
              >
                <span>you@company.com</span>
                <i />
              </div>
            </div>
          </div>

          <div ref={boxRef} className="pick-box pg-box">
            <span className="pick-label" ref={labelRef} />
          </div>
        </div>

        <div className="pg-code">
          {pick ? (
            <>
              <div className="fname">{pick.file}</div>
              {lines.map((l, i) => (
                <span key={i} className="ln">
                  <span className={l.cls ? `tok-${l.cls}` : 'tok-text'}>{l.shown}</span>
                  {i === lastIdx && <span className="caret" />}
                </span>
              ))}
              {typed >= total && <span className="ln tok-ok">✓ deterministic — same output every run</span>}
            </>
          ) : (
            <div className="pg-empty">
              <span className="pg-empty-mark" />
              <p>Nothing picked yet.</p>
              <span>Hover any element on the left, then click to extract it.</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
