'use client';

export default function InstallCopy() {
  return (
    <button className="install" onClick={() => navigator.clipboard?.writeText('npx snapui-cli')}>
      <span className="dollar">$</span> npx snapui-cli
      <span style={{ color: 'var(--ink-faint)', fontSize: 12 }}>⌘C</span>
    </button>
  );
}
