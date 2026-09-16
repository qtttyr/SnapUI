'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/#how', label: 'How it works', n: '01' },
  { href: '/#try', label: 'Playground', n: '02' },
  { href: '/docs', label: 'Docs', n: '03' },
  { href: '/download', label: 'Download', n: '04' },
  { href: '/pricing', label: 'Pricing', n: '05' },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="wrap nav-inner">
        <div className="nav-left">
          <Link href="/" className="logo">
            <span className="mark" /> snap<span style={{ color: 'var(--signal)' }}>·</span>ui
          </Link>
          <span className="nav-sep" />
          <div className="nav-links">
            {LINKS.map((l) => {
              const active = pathname === l.href || (l.href.startsWith('/#') && pathname === '/');
              return (
                <Link key={l.href} href={l.href} className={active ? 'active' : undefined}>
                  <sup className="nav-n">{l.n}</sup>
                  {l.label}
                </Link>
              );
            })}
          </div>
        </div>
        <div className="nav-right">
          <span className="nav-version">v0.1 · MIT</span>
          <span className="nav-live"><i />live</span>
          <Link href="/download" className="btn btn-primary nav-dl-btn">
            npx snapui-cli
          </Link>
          <a href="https://github.com/qtttyr/SnapUI" className="btn btn-ghost nav-gh" target="_blank" rel="noreferrer">
            GitHub ↗
          </a>
        </div>
      </div>
    </nav>
  );
}
