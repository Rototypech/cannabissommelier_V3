// Async Server Component – fetches categories once per request (ISR 1h)
import Image from 'next/image';
import Link from 'next/link';
import { fetchGraphQL } from '@/lib/api';
import { CATEGORIES_QUERY } from '@/lib/queries';
import { Navigation } from '@/components/Navigation';
import type { Category } from '@/types/product';

interface CategoriesData {
  productCategories: { nodes: Category[] };
}

export async function Header({ locale }: { locale: 'en' | 'de' }) {
  // Fetched here so Navigation (Client Component) receives data as props
  // without needing a client-side GraphQL call
  let categories: Category[] = [];
  try {
    const data = await fetchGraphQL<CategoriesData>(
      CATEGORIES_QUERY,
      undefined,
      3600 // revalidate every hour
    );
    categories = data.productCategories.nodes;
  } catch (error) {
    console.error('Failed to fetch categories for Header:', error);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-neutral-100 bg-white/95 backdrop-blur-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950/95">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-6">

        {/* Logo – CSS-based theme switcher (no hydration flash) */}
        <Link href={`/${locale}`} className="shrink-0 transition-opacity hover:opacity-60">
          <Image
            src="/images/logo_cs_white.svg"
            alt="Cannabis Sommelier"
            width={140}
            height={32}
            priority
            className="block h-8 w-auto dark:hidden"
          />
          <Image
            src="/images/logo_cs_black.png"
            alt="Cannabis Sommelier"
            width={140}
            height={32}
            priority
            className="hidden h-8 w-auto dark:block"
          />
        </Link>

        {/* Navigation: desktop links + ThemeToggle + mobile burger
            Wrapped in Suspense internally for useSearchParams */}
        <Navigation categories={categories} locale={locale} />

      </div>
    </header>
  );
}
