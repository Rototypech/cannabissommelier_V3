import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Header } from '@/components/Header';
import { B2BProvider } from '@/components/B2BProvider';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: 'Cannabis Sommelier',
    template: '%s | Cannabis Sommelier',
  },
  description: 'Premium cannabis products',
  alternates: {
    canonical: 'https://cannabissommelier.ch',
    languages: {
      'de-CH': 'https://cannabissommelier.ch/de',
      'en-CH': 'https://cannabissommelier.ch/en',
    },
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  return (
    <html lang={locale} className={inter.variable} suppressHydrationWarning>
      <body className="bg-white font-[family-name:var(--font-inter)] text-neutral-900 antialiased transition-colors duration-300 dark:bg-neutral-950 dark:text-neutral-100">
        <ThemeProvider>
          <B2BProvider>
            <Header locale={locale as 'en' | 'de'} />

            <main className="mx-auto max-w-7xl px-6">
              {children}
            </main>

            <footer className="mt-24 border-t border-neutral-100 transition-colors duration-300 dark:border-neutral-800">
              <div className="mx-auto max-w-7xl px-6 py-8">
                <p className="text-xs font-light text-neutral-400 dark:text-neutral-600">
                  © {new Date().getFullYear()} Cannabis Sommelier
                </p>
              </div>
            </footer>
          </B2BProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
