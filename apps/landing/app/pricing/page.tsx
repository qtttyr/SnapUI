'use client';

import Link from 'next/link';
import Nav from '../components/Nav';
import Reveal from '../components/Reveal';
import ScrollProgress from '../components/ScrollProgress';
import Magnetic from '../components/Magnetic';

export default function PricingPage() {
  return (
    <>
      <div className="blueprint" />
      <ScrollProgress />
      <Nav />

      <main className="pricing-page wrap">
        <header className="pricing-hero">
          <Reveal>
            <div className="hero-kicker"><span className="k-dot" />Open Source & Transparent</div>
            <h1 className="pricing-title">
              100% Free & Open Source. <span className="signal">Forever.</span>
            </h1>
            <p className="pricing-lead">
              SnapUI is licensed under MIT. No hidden subscriptions, no usage caps, no paywalled features.
            </p>
          </Reveal>
        </header>

        <section className="pricing-cards">
          <Reveal delay={50}>
            <div className="p-card open-source">
              <span className="p-badge">MIT LICENSE</span>
              <h2>Developer Free</h2>
              <div className="p-price">$0 <span>/ forever</span></div>
              <p className="p-desc">For developers, designers, and open-source creators.</p>
              <ul className="p-features">
                <li>✓ Unlimited DOM element captures</li>
                <li>✓ React TSX, Vue SFC & Svelte generators</li>
                <li>✓ CSS & Tailwind utility output</li>
                <li>✓ Automatic 90% parent CSS pruning</li>
                <li>✓ Full Chrome DevTools Protocol engine</li>
                <li>✓ Storybook <code>.stories.tsx</code> generation</li>
                <li>✓ 100% local offline execution</li>
              </ul>
              <Magnetic>
                <Link href="/download" className="btn btn-primary p-btn">Start using npx snapui →</Link>
              </Magnetic>
            </div>
          </Reveal>

          <Reveal delay={120}>
            <div className="p-card byo-key">
              <span className="p-badge signal-badge">OPTIONAL AI</span>
              <h2>BYO-Key AI Refinement</h2>
              <div className="p-price">Your API Key</div>
              <p className="p-desc">Use your own OpenAI / Ollama key for smart refactoring.</p>
              <ul className="p-features">
                <li>✓ Everything in Developer Free</li>
                <li>✓ Connect OpenAI, Anthropic, or Ollama</li>
                <li>✓ Automatic semantic prop naming</li>
                <li>✓ Custom component refactoring rules</li>
                <li>✓ Zero markup fees — pay your provider direct</li>
                <li>✓ 100% local model support (Ollama / LM Studio)</li>
              </ul>
              <Magnetic>
                <Link href="/docs#llm-config" className="btn btn-ghost p-btn">View AI Setup Guide →</Link>
              </Magnetic>
            </div>
          </Reveal>
        </section>

        {/* Enterprise & Privacy FAQ */}
        <section className="pricing-faq">
          <Reveal>
            <div className="eyebrow">Frequently Asked Questions</div>
            <h2 className="title">Clear answers to your security & usage questions</h2>
          </Reveal>

          <div className="faq-grid">
            <Reveal delay={50}>
              <div className="faq-item">
                <h3>Is SnapUI really completely free?</h3>
                <p>Yes. SnapUI is 100% open-source software under the MIT license. You can use it in commercial projects, personal apps, or team workflows without paying anything.</p>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="faq-item">
                <h3>Does SnapUI send my DOM data to any server?</h3>
                <p>Never. All DOM inspection, computed style calculations, and code generation happen locally inside your Node.js runtime. No data is sent to external servers.</p>
              </div>
            </Reveal>

            <Reveal delay={150}>
              <div className="faq-item">
                <h3>Can I run SnapUI completely offline?</h3>
                <p>Yes! Once Chrome is available on your machine, SnapUI requires no internet connection whatsoever to capture elements and generate code.</p>
              </div>
            </Reveal>

            <Reveal delay={200}>
              <div className="faq-item">
                <h3>How do I clean up or uninstall SnapUI?</h3>
                <p>Simply run <code>npx snapui uninstall</code> in your terminal. It completely deletes the <code>~/.snapui</code> directory and all cached Chrome binaries.</p>
              </div>
            </Reveal>
          </div>
        </section>
      </main>

      <footer className="wrap foot-inner">
        <span>snap·ui — built with its own philosophy: real DOM, real code.</span>
        <span style={{ display: 'flex', gap: 24 }}>
          <Link href="/">Home</Link>
          <Link href="/docs">Docs</Link>
          <Link href="/download">Download</Link>
          <a href="https://github.com">GitHub</a>
        </span>
      </footer>
    </>
  );
}
