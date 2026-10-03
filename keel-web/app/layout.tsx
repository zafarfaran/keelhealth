import type { Metadata, Viewport } from 'next';
import { Outfit, Newsreader, IBM_Plex_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-outfit',
  display: 'swap',
});

const newsreader = Newsreader({
  subsets: ['latin'],
  weight: ['400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-newsreader',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  metadataBase: new URL('https://keelhealth.com'),
  title: 'Keel · Your strength and nutrition coach',
  description:
    'Eat enough protein. Build muscle. Feel stronger. Keel is a strength and nutrition coach built for women. 7-day free trial.',
  openGraph: {
    title: 'Keel · Your strength and nutrition coach',
    description:
      'Eat enough protein. Build muscle. Feel stronger. Stay healthy for the years ahead.',
    images: ['/assets/keel-social-banner.png'],
  },
  icons: {
    icon: [
      { url: '/assets/keel-favicon.svg', type: 'image/svg+xml' },
      { url: '/assets/keel-favicon-48.png', sizes: '48x48' },
    ],
  },
};

export const viewport: Viewport = {
  themeColor: '#FBF8F4',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en-GB"
      className={`${outfit.variable} ${newsreader.variable} ${plexMono.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
