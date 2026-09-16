import CaptureDemo from './components/CaptureDemo';
import Reveal from './components/Reveal';
import InstallCopy from './components/InstallCopy';
import ScrollProgress from './components/ScrollProgress';
import Magnetic from './components/Magnetic';
import Nav from './components/Nav';
import Playground from './components/Playground';
import DocsSection from './components/DocsSection';
import PricingSection from './components/PricingSection';
import DownloadSection from './components/DownloadSection';

const frameworks = [
  { b: 'React', s: '.tsx' },
  { b: 'Vue', s: '.vue' },
  { b: 'Svelte', s: '.svelte' },
  { b: 'HTML', s: '.html' },
  { b: 'CSS', s: '.css' },
  { b: 'SCSS', s: '.scss' },
  { b: 'Modules', s: '.module.css' },
  { b: 'Tailwind', s: '🜲' },
  { b: 'Storybook', s: '.stories' },
];

export default function Home() {
  return (
    <>
      <div className="blueprint" />
      <ScrollProgress />

      <Nav />

      <div className="chrome-banner">
        <span className="cb-icon">⬤</span>
        <span><b>SnapUI requires Google Chrome.</b> No Chrome — no tool. No Chrome installed? The CLI downloads its own private copy on first run.</span>
        <a href="#requirements">details ↓</a>
      </div>

      <header className="hero wrap">
        <div className="hero-grid">
          <div className="hero-main">
            <div className="hero-kicker"><span className="k-dot" />Chrome DevTools Protocol — zero AI guessing</div>
            <h1 className="headline">
              <span className="hw">Click</span> <span className="hw">an</span> <span className="hw">element.</span>
              <br />
              <span className="hw hw2">Get</span> <span className="hw hw2">a</span>{' '}
              <span className="hw hw2"><em className="signal">real</em></span> <span className="hw hw2">component.</span>
            </h1>
            <p className="sub">
              SnapUI reads the <b>live DOM</b> of any website, strips the junk, and generates
              pixel-accurate <b>React, Vue or Svelte</b> components with clean CSS — deterministically,
              from real computed styles. Not a screenshot. Not a guess.
            </p>
            <div className="hero-cta">
              <Magnetic>
                <a href="#how" className="btn btn-primary">npx snapui-cli →</a>
              </Magnetic>
              <Magnetic>
                <a href="#try" className="btn btn-ghost">Try it below ↓</a>
              </Magnetic>
            </div>
            <InstallCopy />
          </div>

          <aside className="hero-spec">
            <div className="spec-cap">SPEC // snapui v0.1</div>
            {[
              ['requires', 'Google Chrome', 'hl'],
              ['engine', 'cdp protocol'],
              ['guessing', 'none'],
              ['output', '.tsx .vue .svelte'],
              ['runtime deps', '0'],
              ['license', 'MIT'],
            ].map(([k, v, c]) => (
              <div className="spec-row" key={k}>
                <span>{k}</span>
                <b className={c === 'hl' ? 'spec-hl' : undefined}>{v}</b>
              </div>
            ))}
            <div className="spec-sig">▦</div>
          </aside>
        </div>

        <Reveal>
          <div className="demo-area">
            <CaptureDemo />
          </div>
        </Reveal>
      </header>

      <div className="marquee">
        <div className="marquee-track">
          {[...frameworks, ...frameworks].map((f, i) => (
            <span className="marquee-item" key={i}>
              <span className="sq" /> <b>{f.b}</b> {f.s}
            </span>
          ))}
        </div>
      </div>

      <section id="how" className="wrap">
        <Reveal>
          <div className="eyebrow">How it works</div>
          <h2 className="title">Three moves. That&apos;s the whole dance.</h2>
        </Reveal>
        <div className="steps">
          {[
            { n: '01', h: 'Point & click', p: 'SnapUI opens the site in Chrome (or attaches to your own Chrome with your logins). A signal-orange outline follows your cursor — click anything.', c: 'npx snapui-cli' },
            { n: '02', h: 'Real extraction', p: 'It walks the live DOM, reads actual computed styles, prunes browser defaults and renames anonymous nodes with clean BEM-ish names.', c: 'DOM → IR' },
            { n: '03', h: 'Code, not vibes', p: 'A deterministic generator turns the IR into your framework — with Storybook stories. Optional LLM polish, your key, your choice.', c: 'IR → React' },
          ].map((s) => (
            <Reveal key={s.n}>
              <div className="step">
                <div className="step-num">{s.n}</div>
                <h3>{s.h}</h3>
                <p>{s.p}</p>
                <p style={{ marginTop: 16 }}><span className="code">{s.c}</span></p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="try" className="wrap">
        <Reveal>
          <div className="eyebrow">Try it live</div>
          <h2 className="title">Don&apos;t read about it. Feel it.</h2>
        </Reveal>
        <Reveal>
          <div className="pg-area">
            <Playground />
          </div>
        </Reveal>
      </section>

      <section id="compare" className="wrap">
        <Reveal>
          <div className="eyebrow">Why it&apos;s different</div>
          <h2 className="title">Determinism &gt; hallucination.</h2>
        </Reveal>
        <div className="compare">
          <Reveal>
            <div className="compare-card loser">
              <span className="tag">Screenshot → AI</span>
              <h3>The usual approach</h3>
              <p className="desc">Feed a screenshot to a vision model and hope it looks right.</p>
              {[
                ['Output', 'probably', 'no'],
                ['Spacing values', 'invented', 'no'],
                ['Colors', 'close enough', 'no'],
                ['Runs offline', 'never', 'no'],
              ].map(([k, v, c]) => (
                <div className="compare-row" key={k}><span className="k">{k}</span><span className={`v ${c}`}>{v}</span></div>
              ))}
            </div>
          </Reveal>
          <Reveal delay={120}>
            <div className="compare-card win">
              <span className="tag">SnapUI</span>
              <h3>Live DOM → IR → code</h3>
              <p className="desc">Same input, same output. Every single time. It&apos;s code, not a horoscope.</p>
              {[
                ['Computed styles', 'exact', 'yes'],
                ['Default-style junk', 'pruned', 'yes'],
                ['Deterministic', 'always', 'yes'],
                ['Your framework', 'pick any', 'hl'],
              ].map(([k, v, c]) => (
                <div className="compare-row" key={k}><span className="k">{k}</span><span className={`v ${c}`}>{v}</span></div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      <section id="features" className="wrap">
        <Reveal>
          <div className="eyebrow">Under the hood</div>
          <h2 className="title">Small tool. Serious machinery.</h2>
        </Reveal>
        <div className="features">
          {[
            { i: '🎯', h: 'Computed-style extraction', p: 'Real values from the live page via CDP. Per-tag probe cache prunes browser defaults — no margin: 0 × 200.' },
            { i: '🧩', h: 'Neutral IR core', p: 'DOM compiles to a framework-agnostic IRNode tree. Adding a framework = one new pure generator function.' },
            { i: '🏷️', h: 'Smart class naming', p: 'Reuses the site’s meaningful classes; anonymous divs get clean name__tag names. Zero dumpster classnames.' },
            { i: '🌬️', h: 'Tailwind mode', p: '4px spacing scale, color mapping, arbitrary values like w-[347px] — utilities in markup, no config ceremony.' },
            { i: '📖', h: 'Storybook included', p: 'Every React component ships with a story file. Open Storybook, see it rendered, tweak and go.' },
            { i: '🤖', h: 'Optional LLM polish', p: 'Deterministic first. Want comments and better names? BYO OpenAI-compatible key — Ollama works too. Fully local.' },
          ].map((f, i) => (
            <Reveal key={f.h} delay={i * 70}>
              <div className="feature">
                <div className="fnum">0{i + 1}</div>
                <div className="icon">{f.i}</div>
                <h3>{f.h}</h3>
                <p>{f.p}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section id="requirements" className="wrap">
        <Reveal>
          <div className="eyebrow">Requirements</div>
          <h2 className="title">One requirement: Chrome.</h2>
          <p className="lead">
            SnapUI talks the Chrome DevTools Protocol — a Chrome-only dialect.
            Safari, Firefox and the rest simply don&apos;t speak it.
          </p>
        </Reveal>
        <div className="req-grid">
          {[
            {
              k: 'ok',
              i: '✓',
              h: 'I have Chrome',
              p: 'You are done. SnapUI uses your installed Chrome with an isolated profile — or attaches to a running instance with your logins.',
              code: 'nothing to install',
            },
            {
              k: 'dl',
              i: '↓',
              h: 'I don\'t have Chrome',
              p: 'First run of the CLI downloads a private copy of Chrome-for-Testing into ~/.snapui/browser. ~150 MB, once. Your system stays untouched.',
              code: 'npx snapui-cli  # auto-downloads',
            },
            {
              k: 'no',
              i: '✕',
              h: 'I use Safari / Firefox / Edge',
              p: 'Not supported. The DevTools Protocol we read computed styles from exists only in Chromium. Edge may technically work — untested, unsupported.',
              code: null,
            },
          ].map((c) => (
            <Reveal key={c.h}>
              <div className={`req-card req-${c.k}`}>
                <div className="req-ic">{c.i}</div>
                <h3>{c.h}</h3>
                <p>{c.p}</p>
                {c.code && <span className="code">{c.code}</span>}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <DocsSection />
      <DownloadSection />
      <PricingSection />

      <div className="quote-strip">
        <div className="wrap">
          <Reveal>
            <p className="q">
              “The fastest code is the code you <em>never had to write.</em>”
            </p>
            <p className="who">— every developer, five minutes after trying SnapUI</p>
          </Reveal>
        </div>
      </div>

      <section className="wrap">
        <Reveal>
          <div className="cta">
            <div className="eyebrow">Free & open source · MIT</div>
            <h2 className="title" style={{ margin: '0 auto 20px' }}>Stop rebuilding what already exists.</h2>
            <p className="lead">Any site. Any element. One click. Real code.</p>
            <Magnetic>
              <a href="#how" className="btn btn-primary">npx snapui-cli →</a>
            </Magnetic>
            <p className="cta-fine">requires Google Chrome · everything stays on your machine</p>
          </div>
        </Reveal>
      </section>

      <footer>
        <div className="wrap foot-inner">
          <span>snap·ui — built with its own philosophy: real DOM, real code.</span>
          <span style={{ display: 'flex', gap: 24 }}>
            <a href="https://github.com/qtttyr/SnapUI">GitHub</a>
            <a href="#requirements">Requirements</a>
            <a href="#how">Docs</a>
            <a href="#">MIT License</a>
          </span>
        </div>
      </footer>
    </>
  );
}
