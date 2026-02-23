import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Payroll Calculator — Jamaica Dev Kit',
  description: 'Calculate Jamaican payroll deductions with PAYE, NIS, NHT, and education tax.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <header className="border-b border-[var(--border)] backdrop-blur-md sticky top-0 z-50 bg-[var(--bg)]/80">
          <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-semibold tracking-tight">Payroll Calculator</h1>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
                Jamaica Dev Kit
              </span>
            </div>
          </div>
        </header>
        <main className="max-w-6xl mx-auto px-6 py-8">{children}</main>
        <footer className="border-t border-[var(--border)] mt-16">
          <div className="max-w-6xl mx-auto px-6 py-6 text-center text-sm text-[var(--text-muted)]">
            Powered by jamaica-tax &amp; jamaica-currency
          </div>
        </footer>
      </body>
    </html>
  );
}
