import type { Metadata } from 'next';
import { DarkModeToggle } from '../components/DarkModeToggle';
import './globals.css';

export const metadata: Metadata = {
  title: 'Parish Dashboard — Jamaica Dev Kit',
  description: 'Explore all 14 parishes of Jamaica — population, services, health, education, economy, and more.',
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
              <h1 className="text-lg font-semibold tracking-tight">Parish Dashboard</h1>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                Jamaica Dev Kit
              </span>
            </div>
            <DarkModeToggle />
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-6 py-8">{children}</main>
        <footer className="border-t border-[var(--border)] mt-16">
          <div className="max-w-7xl mx-auto px-6 py-6 text-center text-sm text-[var(--text-muted)]">
            Powered by jamaica-parishes, jamaica-schools, jamaica-health, jamaica-emergency, jamaica-places &amp; jamaica-banks
          </div>
        </footer>
      </body>
    </html>
  );
}
