'use client';

import { useState } from 'react';
import Reveal from './Reveal';

export default function DownloadSection() {
  const [copied, setCopied] = useState(false);
  const command = 'npx snapui';

  const copyCommand = () => {
    navigator.clipboard.writeText(command);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section id="download" className="wrap">
      <Reveal>
        <div className="download-box">
          <div className="eyebrow" style={{ justifyContent: 'center' }}>DOWNLOAD // QUICKSTART</div>
          <h2 className="title" style={{ margin: '0 auto 16px', textAlign: 'center' }}>
            Ready to compile the web?
          </h2>
          <p className="lead" style={{ margin: '0 auto 36px', textAlign: 'center' }}>
            No installation required. Run directly via npx in any terminal.
          </p>

          <div className="download-copy-bar" onClick={copyCommand}>
            <span className="dollar">$</span>
            <code>{command}</code>
            <button className="copy-btn">{copied ? 'Copied ✓' : 'Copy'}</button>
          </div>

          <div className="download-specs">
            <div className="dl-spec-item">
              <span className="dl-icon">⚡</span>
              <div>
                <b>Instant Run</b>
                <span>Zero npm install required</span>
              </div>
            </div>

            <div className="dl-spec-item">
              <span className="dl-icon">🌐</span>
              <div>
                <b>Chrome Auto-Fetch</b>
                <span>CFT (~150MB) downloaded if no Chrome found</span>
              </div>
            </div>

            <div className="dl-spec-item">
              <span className="dl-icon">🔒</span>
              <div>
                <b>100% Private</b>
                <span>Runs isolated locally on your machine</span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
