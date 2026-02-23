import type { Metadata } from 'next';
import { DarkModeToggle } from '../components/DarkModeToggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'Gov Services Portal — Jamaica Dev Kit',
  description: 'Browse and search Jamaica government service fees, validate TRNs, and check public holidays.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){var t=localStorage.getItem('theme');var d=t==='dark'||(!t&&matchMedia('(prefers-color-scheme:dark)').matches);if(d)document.documentElement.classList.add('dark')})()` }} />
      </head>
      <body className="min-h-screen">
        <header className="border-b border-[var(--border)] backdrop-blur-md sticky top-0 z-50 bg-[var(--bg)]/80">
          <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[var(--brand)] flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="white"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                >
                  <path d="M3 21h18" />
                  <path d="M5 21V7l8-4v18" />
                  <path d="M19 21V11l-6-4" />
                  <path d="M9 9v.01" />
                  <path d="M9 12v.01" />
                  <path d="M9 15v.01" />
                  <path d="M9 18v.01" />
                </svg>
              </div>
              <h1 className="text-lg font-semibold tracking-tight">Gov Services Portal</h1>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                Jamaica Dev Kit
              </span>
            </div>
            <DarkModeToggle />
          </div>
        </header>
        <main>{children}</main>
        <footer className="border-t border-[var(--border)] mt-16">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-[var(--text-muted)]">
            Powered by jamaica-gov-fees, jamaica-trn, jamaica-currency &amp; jamaica-holidays
          </div>
        </footer>
      </body>
    </html>
  );
}
