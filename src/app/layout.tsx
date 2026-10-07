import type { Metadata } from 'next';
import './globals.css';
import { SmoothScroll } from '../components/providers/SmoothScroll';

export const metadata: Metadata = {
  title: 'Najm Estates KSA - Luxury Saudi Real Estate',
  description:
    'Premier luxury real estate brokerage in the Kingdom of Saudi Arabia, specializing in high-end residential, commercial, and off-market properties across Riyadh, Makkah, Madinah, and Jeddah.',
  openGraph: {
    title: 'Najm Estates KSA - Luxury Saudi Real Estate',
    description:
      'Premier luxury real estate brokerage in the Kingdom of Saudi Arabia, specializing in high-end residential, commercial, and off-market properties across Riyadh, Makkah, Madinah, and Jeddah.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E%3Cpath d='M8 26V6l8 12V6h8v20l-8-12v12H8z' fill='%230C3826'/%3E%3C/svg%3E",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                var _origFetch = window.fetch;
                var _currentFetch = _origFetch;
                Object.defineProperty(window, 'fetch', {
                  configurable: true,
                  enumerable: true,
                  get: function() { return _currentFetch; },
                  set: function(fn) { _currentFetch = fn; }
                });
              } catch(e) {}
            `,
          }}
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        suppressHydrationWarning
        className="bg-[#FFFFFF] text-[#141A17] antialiased selection:bg-[#0C3826]/15 selection:text-[#0C3826]"
      >
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
