import type { Metadata, Viewport } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'SnapUI — Click any element. Get a real component.',
  description:
    'SnapUI hooks into the live DOM via Chrome DevTools Protocol and generates pixel-accurate React, Vue, Svelte components with clean CSS or Tailwind. No AI guessing. Deterministic. Free.',
  openGraph: {
    title: 'SnapUI — Click any element. Get a real component.',
    description: 'Live DOM → clean code. Pixel-perfect. Deterministic. Open source.',
    type: 'website',
  },
  icons: {
    icon: '/icon.svg',
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export const viewport: Viewport = {
  themeColor: '#f4f1ea',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
