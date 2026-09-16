'use client';

import Reveal from './Reveal';
import Magnetic from './Magnetic';

export default function PricingSection() {
  return (
    <section id="pricing" className="wrap">
      <Reveal>
        <div className="eyebrow">Pricing & Licensing</div>
        <h2 className="title">100% Free Open Source. Zero BS.</h2>
        <p className="lead">
          SnapUI is built for developers. The core compiler is MIT licensed and runs entirely on your machine.
        </p>
      </Reveal>

      <div className="pricing-grid">
        <Reveal>
          <div className="pricing-card free">
            <div className="pricing-badge">OPEN SOURCE</div>
            <h3>Community Edition</h3>
            <div className="pricing-amount">
              <span className="cur">$</span>0
              <span className="per">/ forever</span>
            </div>
            <p className="pricing-desc">Full interactive CLI & DOM compiler for individual developers and teams.</p>

            <ul className="pricing-features">
              <li><span className="check">✓</span> <b>Unlimited</b> DOM element captures</li>
              <li><span className="check">✓</span> React TSX, Vue SFC, Svelte & HTML</li>
              <li><span className="check">✓</span> CSS, Tailwind & CSS Modules output</li>
              <li><span className="check">✓</span> Storybook story generation</li>
              <li><span className="check">✓</span> Attach to logged-in Chrome (port 9222)</li>
              <li><span className="check">✓</span> 100% Local — zero data sent to servers</li>
              <li><span className="check">✓</span> MIT License</li>
            </ul>

            <div className="pricing-action">
              <Magnetic>
                <a href="#how" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
                  npx snapui →
                </a>
              </Magnetic>
            </div>
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="pricing-card pro">
            <div className="pricing-badge pro-badge">ENTERPRISE SUITE</div>
            <h3>Self-Hosted Team Pro</h3>
            <div className="pricing-amount">
              <span className="cur">$</span>29
              <span className="per">/ dev / mo</span>
            </div>
            <p className="pricing-desc">Advanced local AI polish, shared design system token mapping & team CLI configs.</p>

            <ul className="pricing-features">
              <li><span className="check">✓</span> Everything in Community Edition</li>
              <li><span className="check">✓</span> <b>Local Ollama / LLM Polish</b> for custom prop naming</li>
              <li><span className="check">✓</span> Custom Design Token mapping (Figma & Tailwind)</li>
              <li><span className="check">✓</span> Automated Figma component sync</li>
              <li><span className="check">✓</span> Shared team CLI presets & configs</li>
              <li><span className="check">✓</span> Dedicated Discord & priority support</li>
            </ul>

            <div className="pricing-action">
              <Magnetic>
                <a href="https://github.com" className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}>
                  Contact Enterprise →
                </a>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
