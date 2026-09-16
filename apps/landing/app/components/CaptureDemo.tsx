'use client';

import { useEffect, useRef, useState } from 'react';

/* Animated capture demo: a cursor picks a button on a mock site,
   then the code panel "types" the generated component. Loops forever. */

const CODE_LINES = [
  { text: '<button className="cta-button">', className: 'tok-tag' },
  { text: '  Start free trial', className: 'tok-text' },
  { text: '</button>', className: 'tok-tag' },
];

type Phase = 'idle' | 'picking' | 'typing' | 'hold';

export default function CaptureDemo() {
  const [phase, setPhase] = useState<Phase>('idle');
  const [typed, setTyped] = useState(0); // chars typed across all lines
  const siteRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const cursorRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);

  // subtle 3D tilt following the cursor
  useEffect(() => {
    const el = frameRef.current;
    if (!el || window.matchMedia('(hover: none)').matches) return;
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      const rx = ((e.clientY - r.top) / r.height - 0.5) * -2.4;
      const ry = ((e.clientX - r.left) / r.width - 0.5) * 2.4;
      el.style.transform = `perspective(1200px) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    const leave = () => { el.style.transform = ''; };
    el.addEventListener('mousemove', move);
    el.addEventListener('mouseleave', leave);
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave); };
  }, []);

  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];
    const t = (fn: () => void, ms: number) => timers.push(setTimeout(fn, ms));

    function moveCursorAndBox() {
      const site = siteRef.current, btn = btnRef.current,
        box = boxRef.current, cur = cursorRef.current;
      if (!site || !btn || !box || !cur) return;
      const sb = site.getBoundingClientRect();
      const bb = btn.getBoundingClientRect();
      const x = bb.left - sb.left, y = bb.top - sb.top;
      box.style.left = `${x - 6}px`;
      box.style.top = `${y - 6}px`;
      box.style.width = `${bb.width + 12}px`;
      box.style.height = `${bb.height + 12}px`;
      cur.style.left = `${x + bb.width - 4}px`;
      cur.style.top = `${y + bb.height - 4}px`;
    }

    function cycle() {
      setPhase('picking');
      setTyped(0);
      moveCursorAndBox();
      t(() => setPhase('typing'), 1800);
      t(() => setPhase('hold'), 6800);
      t(cycle, 10600);
    }

    cycle();
    window.addEventListener('resize', moveCursorAndBox);
    return () => { timers.forEach(clearTimeout); window.removeEventListener('resize', moveCursorAndBox); };
  }, []);

  // typewriter effect
  useEffect(() => {
    if (phase !== 'typing') return;
    const total = CODE_LINES.reduce((n, l) => n + l.text.length, 0);
    const iv = setInterval(() => {
      setTyped((n) => (n >= total ? n : n + 1));
    }, 14);
    return () => clearInterval(iv);
  }, [phase]);

  let remaining = typed;
  const lines = CODE_LINES.map((l) => {
    const shown = l.text.slice(0, Math.max(0, remaining));
    remaining -= l.text.length;
    return shown;
  });
  const isTyping = phase === 'typing';
  const lastIdx = lines.reduce((last, text, i) => (isTyping && text.length > 0 && text.length < CODE_LINES[i].text.length ? i : (isTyping && text.length === CODE_LINES[i].text.length ? i : last)), -1);

  return (
    <div className="demo-frame tilt" ref={frameRef}>
      <div className="demo-chrome">
        <span className="c c1" /><span className="c c2" /><span className="c c3" />
        <span className="demo-url">acme.io/pricing</span>
      </div>
      <div className="demo-body">
        <div className="demo-site" ref={siteRef}>
          <div className="fake-nav">
            <span className="fn-logo">Acme</span>
            <div className="fn-links"><span /><span /><span /></div>
            <div className="fn-cta" />
          </div>
          <h3>Ship faster<br />than ever.</h3>
          <p className="fake-p">The modern platform for teams that move fast and break nothing.</p>
          <div className="fake-actions">
            <div ref={btnRef} className="fake-btn1" />
            <div className="fake-btn2" />
          </div>

          <div ref={boxRef} className={`pick-box ${phase !== 'idle' ? 'show' : ''}`}>
            <span className="pick-label">button.cta-button · 110×38</span>
          </div>
          <div ref={cursorRef} className={`pick-cursor ${phase !== 'idle' ? 'show' : ''}`}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="var(--ink)" stroke="var(--paper)" strokeWidth="1.5">
              <path d="M4 2l16 8-7 2-2 7L4 2z" />
            </svg>
          </div>
        </div>

        <div className="demo-code">
          <div className="fname">components/CtaButton.tsx</div>
          {lines.map((text, i) => (
            <span key={i} className="ln">
              {i === 0 && <span className="tok-tag">export default function </span>}
              {i === 0 && <span className="tok-text">CtaButton</span>}
              {i === 0 && <span className="tok-punc">() {'{'}</span>}
              {i > 0 && <span className={`tok-${CODE_LINES[i].className.replace('tok-', '')}`}>{text}</span>}
              {i === lastIdx && <span className="caret" />}
            </span>
          ))}
          {phase === 'hold' && (
            <span className="ln tok-punc">{'}'}</span>
          )}
        </div>
      </div>
    </div>
  );
}
