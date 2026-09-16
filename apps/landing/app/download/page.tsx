'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from '../components/Nav';
import Reveal from '../components/Reveal';
import ScrollProgress from '../components/ScrollProgress';
import Magnetic from '../components/Magnetic';
import InstallCopy from '../components/InstallCopy';

export default function DownloadPage() {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText('npx snapui');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <div className="blueprint" />
      <ScrollProgress />
      <Nav />

      <main className="dl-page wrap">
        <header className="dl-hero">
          <Reveal>
            <div className="hero-kicker"><span className="k-dot" />Zero-Install Execution</div>
            <h1 className="dl-title">
              Run <span className="signal">SnapUI</span> in seconds.
            </h1>
            <p className="dl-lead">
              No long installers, no admin permissions required. Run instantly using <code>npx</code> or download stand-alone binaries for your platform.
            </p>
          </Reveal>

          <Reveal delay={100}>
            <div className="dl-box-card">
              <div className="dl-box-header">
                <span className="dot dot-r" />
                <span className="dot dot-y" />
                <span className="dot dot-g" />
                <span className="title">Terminal — One command execution</span>
              </div>
              <div className="dl-cmd-row">
                <span className="prompt">$</span>
                <code className="cmd">npx snapui</code>
                <button onClick={handleCopy} className="copy-btn">
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="dl-meta">
                <span>Requires Node.js 18+ & Google Chrome</span>
                <span>Works on macOS, Windows, Linux</span>
              </div>
            </div>
          </Reveal>
        </header>

        {/* 3 Step onboarding */}
        <section className="dl-steps-section">
          <Reveal>
            <div className="eyebrow">How to get started</div>
            <h2 className="title">Three simple steps to your first component</h2>
          </Reveal>

          <div className="dl-steps-grid">
            <Reveal delay={50}>
              <div className="dl-step">
                <div className="step-num">01</div>
                <h3>Open Terminal</h3>
                <p>Launch Terminal on macOS, PowerShell / CMD on Windows, or standard shell on Linux.</p>
                <div className="mini-code"><code>terminal.app / powershell</code></div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="dl-step">
                <div className="step-num">02</div>
                <h3>Run npx snapui</h3>
                <p>No global install needed. SnapUI opens Chrome in isolated mode with our live overlay.</p>
                <div className="mini-code"><code>npx snapui [url]</code></div>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="dl-step">
                <div className="step-num">03</div>
                <h3>Click & Copy</h3>
                <p>Click any UI element on screen. SnapUI extracts pure TSX/CSS and saves it instantly.</p>
                <div className="mini-code"><code>3 component file(s) generated ✨</code></div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Security & Control */}
        <section className="dl-trust-section">
          <Reveal>
            <div className="eyebrow">Trust & Security</div>
            <h2 className="title">Built with total respect for your machine</h2>
          </Reveal>

          <div className="trust-grid">
            <div className="trust-card">
              <span className="trust-icon">🔒</span>
              <h3>100% Local Execution</h3>
              <p>Your code, DOM data, and project assets never leave your computer. No cloud telemetry or remote tracking.</p>
            </div>
            <div className="trust-card">
              <span className="trust-icon">🛡️</span>
              <h3>Isolated Chrome Profile</h3>
              <p>SnapUI runs Chrome with a sandboxed temporary profile — your personal logins, cookies, and browsing data stay completely untouched.</p>
            </div>
            <div className="trust-card">
              <span className="trust-icon">🗑️</span>
              <h3>1-Command Purge</h3>
              <p>Want to clean up? Remove all cached Chrome downloads and settings anytime using <code>npx snapui uninstall</code>.</p>
            </div>
          </div>
        </section>

        {/* Uninstallation detail card */}
        <section className="dl-uninstall-card">
          <Reveal>
            <div className="un-inner">
              <div className="un-text">
                <span className="tag">Full Control</span>
                <h2>Easy 1-Command Uninstallation</h2>
                <p>If you ever want to delete SnapUI and free up space, run this single command in your terminal:</p>
              </div>
              <div className="un-cmd">
                <code>npx snapui uninstall</code>
              </div>
            </div>
          </Reveal>
        </section>
      </main>

      <footer className="wrap foot-inner">
        <span>snap·ui — built with its own philosophy: real DOM, real code.</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <Link href="/">Home</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/pricing">Pricing</Link>
          <a href="https://github.com">GitHub</a>
        </span>
      </footer>
    </>
  );
}
