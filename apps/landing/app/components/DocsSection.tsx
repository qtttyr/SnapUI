'use client';

import { useState } from 'react';
import Reveal from './Reveal';

const COMMANDS = [
  {
    cmd: 'npx snapui-cli [url]',
    desc: 'Launch an interactive capture session for a specific target website URL.',
    example: 'npx snapui-cli https://stripe.com',
    details: 'Opens Chromium in isolated profile mode or connects via CDP port 9222. Injects element picker overlay and in-browser control panel.',
  },
  {
    cmd: 'npx snapui-cli config',
    desc: 'View & edit SnapUI global settings (default framework, styling flavor, LLM API keys).',
    example: 'npx snapui-cli config',
    details: 'Saves your preferences to ~/.snapui/config.json for automatic reuse across projects.',
  },
  {
    cmd: 'SNAPUI_PORT=9222 npx snapui-cli',
    desc: 'Attach SnapUI to your logged-in Google Chrome instance.',
    example: 'google-chrome --remote-debugging-port=9222\nSNAPUI_PORT=9222 npx snapui-cli https://app.dashboard.com',
    details: 'Zero downloads, zero re-logins. Captures paywalled or internal dashboard elements using your existing browser session.',
  },
];

const CONFIG_EXAMPLES = [
  {
    file: 'snapui.config.json',
    lang: 'json',
    code: `{
  "framework": "react",
  "style": "tailwind",
  "storybook": true,
  "outputDir": "./src/components"
}`,
  },
  {
    file: 'Component output layout',
    lang: 'text',
    code: `project-root/
├── components/
│   └── IconList.tsx        # Production TSX component with props
├── styles/
│   └── icon-list.css       # Pruned computed styles
└── storybook/
    └── IconList.stories.tsx # Storybook 8 story file`,
  },
];

export default function DocsSection() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <section id="docs" className="wrap">
      <Reveal>
        <div className="eyebrow">Documentation & CLI Guide</div>
        <h2 className="title">Zero fluff. Everything you need to ship.</h2>
        <p className="lead">
          SnapUI is designed as a single zero-dependency CLI. Point it at any URL, click an element, and get pure component code written straight to your workspace.
        </p>
      </Reveal>

      <div className="docs-grid">
        <Reveal>
          <div className="docs-commands">
            <div className="docs-card-header">CLI COMMANDS // REFERENCE</div>
            {COMMANDS.map((c, i) => (
              <div key={i} className="docs-cmd-card">
                <div className="docs-cmd-title">
                  <code>{c.cmd}</code>
                </div>
                <p className="docs-cmd-desc">{c.desc}</p>

                <div className="docs-code-box">
                  <pre><code>{c.example}</code></pre>
                </div>
                <p className="docs-cmd-note">{c.details}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={120}>
          <div className="docs-config">
            <div className="docs-card-header">WORKSPACE // STRUCTURE</div>

            <div className="docs-tabs-nav">
              {CONFIG_EXAMPLES.map((ex, i) => (
                <button
                  key={i}
                  className={`docs-tab-btn ${activeTab === i ? 'active' : ''}`}
                  onClick={() => setActiveTab(i)}
                >
                  {ex.file}
                </button>
              ))}
            </div>

            <div className="docs-code-preview">
              <div className="docs-file-bar">
                <span>{CONFIG_EXAMPLES[activeTab].file}</span>
                <span className="docs-lang">{CONFIG_EXAMPLES[activeTab].lang}</span>
              </div>
              <pre><code>{CONFIG_EXAMPLES[activeTab].code}</code></pre>
            </div>

            <div className="docs-feature-list">
              <div className="docs-feat-item">
                <span className="feat-check">✓</span>
                <div>
                  <b>Framework Agnostic Core</b>
                  <p>Compiles DOM into clean React TSX, Vue 3 SFC, Svelte 4/5, or HTML5.</p>
                </div>
              </div>

              <div className="docs-feat-item">
                <span className="feat-check">✓</span>
                <div>
                  <b>Pruned Computed Styles</b>
                  <p>Prunes default browser styles and parent inherited properties automatically.</p>
                </div>
              </div>

              <div className="docs-feat-item">
                <span className="feat-check">✓</span>
                <div>
                  <b>Storybook 8 Included</b>
                  <p>Generates type-safe Storybook stories out of the box.</p>
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
