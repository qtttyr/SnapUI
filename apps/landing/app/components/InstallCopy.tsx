'use client';

export default function InstallCopy() {
  return (
    <button className="install" onClick={() => navigator.clipboard?.writeText('npx snapui')}>
      <span className="dollar">$</span> npx snapui
      <span style={{ color: 'var(--ink-faint)', fontSize: 12 }}>⌘C</span>
    </button>
  );
}
