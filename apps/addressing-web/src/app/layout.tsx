import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Jamaica Address Finder",
  description:
    "Generate Plus Code addresses for any location in Jamaica",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased h-screen flex flex-col bg-jamaica-gray">
        {/* Header */}
        <header className="bg-jamaica-green text-white shrink-0 z-50 shadow-md">
          <div className="flex items-center justify-between px-4 h-14">
            <div className="flex items-center gap-3">
              {/* Jamaica flag-inspired icon */}
              <div className="w-8 h-8 rounded-md bg-jamaica-gold flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5 text-jamaica-black"
                >
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                  <circle cx="12" cy="10" r="3" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg font-bold leading-tight">
                  Jamaica Address Finder
                </h1>
                <p className="text-xs text-jamaica-gold font-medium leading-tight hidden sm:block">
                  Plus Code Digital Addressing System
                </p>
              </div>
            </div>

            <nav className="hidden md:flex items-center gap-4 text-sm">
              <a
                href="#"
                className="text-white/90 hover:text-jamaica-gold transition-colors"
              >
                About
              </a>
              <a
                href="#"
                className="text-white/90 hover:text-jamaica-gold transition-colors"
              >
                Help
              </a>
            </nav>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-hidden">{children}</main>
      </body>
    </html>
  );
}
