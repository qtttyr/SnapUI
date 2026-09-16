'use client';

import { useState } from 'react';
import Link from 'next/link';
import Nav from '../components/Nav';
import Reveal from '../components/Reveal';
import ScrollProgress from '../components/ScrollProgress';

const DOC_SECTIONS = [
  { id: 'getting-started', title: '01 / Getting Started', kicker: 'Installation & Setup' },
  { id: 'cli-reference', title: '02 / CLI Reference', kicker: 'Commands & Flags' },
  { id: 'architecture', title: '03 / Architecture', kicker: 'CDP & Computed Styles' },
  { id: 'frameworks', title: '04 / Framework Generators', kicker: 'React, Vue, Svelte, HTML' },
  { id: 'llm-config', title: '05 / AI & Refinement', kicker: 'BYO-Key & Ollama' },
  { id: 'cross-platform', title: '06 / Cross-Platform', kicker: 'macOS, Windows, Linux' },
  { id: 'uninstall', title: '07 / Uninstallation', kicker: '1-Command Cleanup' },
];

export default function DocsPage() {
  const [activeSection, setActiveSection] = useState('getting-started');

  return (
    <>
      <div className="blueprint" />
      <ScrollProgress />
      <Nav />

      <main className="doc-page wrap">
        <header className="doc-hero">
          <div className="hero-kicker"><span className="k-dot" />Official Documentation</div>
          <h1 className="doc-title">Everything you need to master <span className="signal">SnapUI</span></h1>
          <p className="doc-lead">
            SnapUI is a zero-telemetry, zero-lock-in live DOM compiler. Learn how to extract pixel-perfect components, configure custom AI models, and run on any operating system.
          </p>
        </header>

        <div className="doc-layout">
          <aside className="doc-nav">
            <div className="doc-nav-sticky">
              <div className="doc-nav-cap">SPEC // INDEX</div>
              {DOC_SECTIONS.map((sec) => (
                <button
                  key={sec.id}
                  onClick={() => {
                    setActiveSection(sec.id);
                    document.getElementById(sec.id)?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className={`doc-nav-item ${activeSection === sec.id ? 'active' : ''}`}
                >
                  <span className="title">{sec.title}</span>
                  <span className="kicker">{sec.kicker}</span>
                </button>
              ))}
            </div>
          </aside>

          <article className="doc-content">
            {/* 01 / Getting Started */}
            <section id="getting-started" className="doc-block">
              <Reveal>
                <div className="eyebrow">01 / Getting Started</div>
                <h2>Zero setup required</h2>
                <p>
                  SnapUI requires no build steps or global configuration to start using.
                  Run the CLI directly using <code>npx snapui</code> in any terminal.
                </p>
                <div className="doc-code-card">
                  <div className="card-head"><span>Terminal</span><span className="badge">Bash / Zsh / PowerShell</span></div>
                  <pre><code>npx snapui</code></pre>
                </div>
                <p>
                  Or specify a target URL directly to launch Google Chrome immediately focused on that site:
                </p>
                <div className="doc-code-card">
                  <pre><code>npx snapui https://stripe.com</code></pre>
                </div>
              </Reveal>
            </section>

            {/* 02 / CLI Reference */}
            <section id="cli-reference" className="doc-block">
              <Reveal>
                <div className="eyebrow">02 / CLI Reference</div>
                <h2>Command Line Interface</h2>
                <div className="doc-table">
                  <div className="table-row head">
                    <span>Command</span>
                    <span>Description</span>
                    <span>Example</span>
                  </div>
                  <div className="table-row">
                    <td><code>npx snapui [url]</code></td>
                    <td>Starts an interactive element selection session.</td>
                    <td><code>npx snapui https://linear.app</code></td>
                  </div>
                  <div className="table-row">
                    <td><code>npx snapui config</code></td>
                    <td>Opens interactive prompt for LLM keys, styling targets, and output dirs.</td>
                    <td><code>npx snapui config</code></td>
                  </div>
                  <div className="table-row">
                    <td><code>npx snapui doctor</code></td>
                    <td>Verifies Chrome installation, OS compatibility, and environment paths.</td>
                    <td><code>npx snapui doctor</code></td>
                  </div>
                  <div className="table-row">
                    <td><code>npx snapui uninstall</code></td>
                    <td>Completely purges <code>~/.snapui</code> browser cache and settings.</td>
                    <td><code>npx snapui uninstall</code></td>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* 03 / Architecture */}
            <section id="architecture" className="doc-block">
              <Reveal>
                <div className="eyebrow">03 / Architecture</div>
                <h2>How CDP Extraction Works</h2>
                <p>
                  Unlike screenshot-to-code AI generators that guess HTML layout and CSS measurements from images,
                  SnapUI operates directly over the <b>Chrome DevTools Protocol (CDP)</b>.
                </p>
                <div className="arch-diagram">
                  <div className="arch-node">
                    <span className="label">1. Chrome Page</span>
                    <span className="sub">Live DOM & Box Model</span>
                  </div>
                  <div className="arch-arrow">→ CDP API →</div>
                  <div className="arch-node active">
                    <span className="label">2. SnapUI Engine</span>
                    <span className="sub">Prune & IR Node</span>
                  </div>
                  <div className="arch-arrow">→ Generator →</div>
                  <div className="arch-node">
                    <span className="label">3. Production Code</span>
                    <span className="sub">React / Vue / Svelte</span>
                  </div>
                </div>
                <ul className="arch-features">
                  <li><b>Exact Measurements:</b> Spacing, padding, gaps, and dimensions read from <code>getComputedStyle</code>.</li>
                  <li><b>90% CSS Pruning:</b> Inherited parent properties and browser defaults (e.g. <code>margin: 0</code>) are automatically stripped out.</li>
                  <li><b>Junk Hash Removal:</b> Class names like <code>.astro-73zxsoak</code> or <code>.jsx-194012</code> are scrubbed for semantic BEM names.</li>
                </ul>
              </Reveal>
            </section>

            {/* 04 / Framework Generators */}
            <section id="frameworks" className="doc-block">
              <Reveal>
                <div className="eyebrow">04 / Framework Generators</div>
                <h2>Framework & Styling Modes</h2>
                <p>SnapUI exports clean, typed components for all modern web tech stacks:</p>
                <div className="framework-grid">
                  <div className="fw-card">
                    <h3>React TSX</h3>
                    <p>Includes TypeScript props interface, HTML attributes extension, and optional <code>.stories.tsx</code> Storybook story.</p>
                  </div>
                  <div className="fw-card">
                    <h3>Vue SFC</h3>
                    <p>Generates single-file <code>.vue</code> components with <code>&lt;script setup lang=&quot;ts&quot;&gt;</code> and <code>&lt;style scoped&gt;</code>.</p>
                  </div>
                  <div className="fw-card">
                    <h3>Svelte</h3>
                    <p>Emits lean Svelte 4/5 markup with scoped style blocks and typed props.</p>
                  </div>
                  <div className="fw-card">
                    <h3>Tailwind CSS</h3>
                    <p>Converts computed inline styles into standard Tailwind utility classes (e.g. <code>px-4 py-2 bg-neutral-900</code>).</p>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* 05 / LLM Config */}
            <section id="llm-config" className="doc-block">
              <Reveal>
                <div className="eyebrow">05 / AI & Refinement</div>
                <h2>Optional LLM Polish</h2>
                <p>
                  SnapUI core is 100% deterministic and requires zero AI models to generate code.
                  If you want semantic prop naming, refactored loops, or inline JSDoc comments, you can enable optional LLM polish.
                </p>
                <div className="doc-code-card">
                  <div className="card-head"><span>~/.snapui/config.json</span></div>
                  <pre><code>{`{
  "llm": {
    "provider": "openai",
    "apiKey": "sk-...",
    "model": "gpt-4o-mini",
    "endpoint": "https://api.openai.com/v1"
  }
}`}</code></pre>
                </div>
                <p>
                  Works seamlessly with local LLM runners like <b>Ollama</b> or <b>LM Studio</b> for 100% offline private refactoring!
                </p>
              </Reveal>
            </section>

            {/* 06 / Cross-Platform */}
            <section id="cross-platform" className="doc-block">
              <Reveal>
                <div className="eyebrow">06 / Cross-Platform</div>
                <h2>macOS, Windows, and Linux Support</h2>
                <p>SnapUI runs natively across all operating systems:</p>
                <div className="os-grid">
                  <div className="os-card">
                    <span className="os-icon"></span>
                    <h3>macOS</h3>
                    <p>Supports Apple Silicon (M1/M2/M3/M4) and Intel x64. Automatically attaches to installed Google Chrome or manages isolated CfT bundle.</p>
                  </div>
                  <div className="os-card">
                    <span className="os-icon">🪟</span>
                    <h3>Windows</h3>
                    <p>Full support for Windows 10/11 PowerShell and CMD. Detects standard Chrome paths in LocalAppData & Program Files.</p>
                  </div>
                  <div className="os-card">
                    <span className="os-icon">🐧</span>
                    <h3>Linux</h3>
                    <p>Compatible with Ubuntu, Debian, Fedora, Arch, and Alpine. Uses system Chrome or unpacks headless Chromium binaries.</p>
                  </div>
                </div>
              </Reveal>
            </section>

            {/* 07 / Uninstallation */}
            <section id="uninstall" className="doc-block">
              <Reveal>
                <div className="eyebrow">07 / Uninstallation</div>
                <h2>Clean 1-Command Uninstallation</h2>
                <p>
                  SnapUI leaves zero lingering background services, daemons, or registry keys.
                  To remove all cached Chrome binaries and settings from your machine, run:
                </p>
                <div className="doc-code-card highlight">
                  <div className="card-head"><span>Terminal</span><span className="badge warning">Clean Purge</span></div>
                  <pre><code>npx snapui uninstall</code></pre>
                </div>
                <p className="sub">
                  This immediately removes <code>~/.snapui</code> and frees ~150MB of disk space.
                </p>
              </Reveal>
            </section>
          </article>
        </div>
      </main>

      <footer className="wrap foot-inner">
        <span>snap·ui — built with its own philosophy: real DOM, real code.</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <Link href="/">Home</Link>
          <Link href="/download">Download</Link>
          <Link href="/pricing">Pricing</Link>
          <a href="https://github.com">GitHub</a>
        </span>
      </footer>
    </>
  );
}
