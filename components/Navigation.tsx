'use client';

import { Suspense, useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { ThemeToggle } from '@/components/ThemeToggle';
import type { Category } from '@/types/product';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface NavItem {
  label: string;
  href: string;
  slug: string | null; // null = "Wszystkie"
}

interface Props {
  categories: Category[];
  locale: 'en' | 'de';
}

// ---------------------------------------------------------------------------
// Inner component – uses useSearchParams (requires Suspense ancestor)
// ---------------------------------------------------------------------------

function NavContent({ categories, locale }: Props) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);

  const activeSlug = searchParams.get('category');
  const onShopRoute = pathname === '/shop' || pathname === '/';

  // Close mobile menu on route/param change
  useEffect(() => setIsOpen(false), [pathname, searchParams]);

  // Group categories by parent
  const categoryTree = categories.reduce((acc, cat) => {
    const parentSlug = cat.parent?.node.slug || 'root';
    if (!acc[parentSlug]) acc[parentSlug] = [];
    acc[parentSlug].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  // Hardcoded top-level order/labels as per user images
  const mainCategories = [
    { label: 'CBD', slug: 'cbd' },
    { label: 'VAPORIZER', slug: 'vaporizer' },
    { label: 'HEADSHOP', slug: 'headshop' },
    { label: 'DABBING / WAX / EXTRAKTE', slug: 'dabbing-wax-extrakte' },
    { label: 'GROW-SHOP', slug: 'grow-shop' },
    { label: 'SHOP ZÜRICH', slug: 'shop-zurich' },
    { label: 'INFO', slug: 'info' },
  ];

  function isActive(itemSlug: string | null) {
    if (!onShopRoute) return false;
    if (itemSlug === null) return !activeSlug;
    if (activeSlug === itemSlug) return true;

    // Check if activeSlug is a child of itemSlug
    const activeCat = categories.find(c => c.slug === activeSlug);
    return activeCat?.parent?.node.slug === itemSlug;
  }

  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  return (
    <>
      {/* Desktop Links */}
      <nav
        className="hidden items-center gap-7 lg:flex"
        role="navigation"
        aria-label="Główna nawigacja"
      >
        <Link
          href={`/${locale}/shop`}
          className={`whitespace-nowrap text-[11px] tracking-[0.1em] transition-colors duration-150 ${isActive(null)
              ? 'font-medium text-black dark:text-white'
              : 'font-light text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white'
            }`}
        >
          {locale === 'en' ? 'ALL' : 'ALLE'}
        </Link>
        {mainCategories.map((cat) => {
          const hasChildren = categoryTree[cat.slug] && categoryTree[cat.slug].length > 0;

          return (
            <div
              key={cat.slug}
              className="relative py-4"
              onMouseEnter={() => hasChildren && setActiveDropdown(cat.slug)}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <Link
                href={`/${locale}/shop?category=${cat.slug}`}
                className={`flex items-center gap-1 whitespace-nowrap text-[11px] tracking-[0.1em] transition-colors duration-150 ${isActive(cat.slug)
                    ? 'font-medium text-black dark:text-white'
                    : 'font-light text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white'
                  }`}
              >
                {cat.label}
                {hasChildren && (
                  <svg className={`h-2.5 w-2.5 transition-transform duration-200 ${activeDropdown === cat.slug ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
                  </svg>
                )}
              </Link>

              {/* Dropdown Panel */}
              {hasChildren && activeDropdown === cat.slug && (
                <div className="absolute left-0 top-[100%] z-50 min-w-[180px] origin-top-left animate-in fade-in zoom-in-95 duration-200">
                  <div className="mt-1 border border-neutral-100 bg-white/95 p-4 shadow-xl backdrop-blur-sm transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950/95">
                    <ul className="space-y-3">
                      {categoryTree[cat.slug].map((sub) => (
                        <li key={sub.slug}>
                          <Link
                            href={`/${locale}/shop?category=${sub.slug}`}
                            onClick={() => setActiveDropdown(null)}
                            className={`block text-[13px] font-light transition-colors duration-150 ${activeSlug === sub.slug
                                ? 'text-black dark:text-white'
                                : 'text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white'
                              }`}
                          >
                            {sub.name}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* ── Right cluster (ThemeToggle + mobile burger) ── */}
      <div className="flex items-center gap-3">
        <ThemeToggle />

        {/* Burger – mobile only */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="flex h-8 w-8 items-center justify-center text-neutral-400 transition-colors hover:text-black dark:text-neutral-500 dark:hover:text-white lg:hidden"
          aria-label={isOpen ? 'Zamknij menu' : 'Otwórz menu'}
          aria-expanded={isOpen}
        >
          {isOpen ? <BurgerClose /> : <BurgerOpen />}
        </button>
      </div>

      {/* ── Mobile Drawer Overlay ── */}
      <div
        className={`fixed inset-0 z-50 transform transition-transform duration-500 ease-in-out lg:hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Backdrop */}
        <div
          className={`absolute inset-0 bg-black/20 backdrop-blur-md transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'
            }`}
          onClick={() => setIsOpen(false)}
        />

        {/* Drawer Content */}
        <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm border-l border-neutral-100 bg-white shadow-2xl transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950">
          <div className="flex h-full flex-col p-8">
            {/* Header in Drawer */}
            <div className="flex items-center justify-between mb-12">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-neutral-400">
                Menu
              </span>
              <button
                onClick={() => setIsOpen(false)}
                className="flex h-11 w-11 items-center justify-center rounded-full border border-neutral-100 dark:border-neutral-800"
              >
                <BurgerClose />
              </button>
            </div>

            {/* Navigation List */}
            <nav className="flex-1 overflow-y-auto pr-4 -mr-4">
              <ul className="space-y-6" role="list">
                <li>
                  <Link
                    href={`/${locale}/shop`}
                    className={`block text-xl font-light tracking-tight ${isActive(null) ? 'text-black dark:text-white' : 'text-neutral-400 dark:text-neutral-600'
                      }`}
                  >
                    {locale === 'en' ? 'ALL' : 'ALLE'}
                  </Link>
                </li>
                {mainCategories.map((cat) => (
                  <li key={cat.slug} className="group">
                    <div className="flex items-center justify-between">
                      <Link
                        href={`/${locale}/shop?category=${cat.slug}`}
                        className={`text-xl font-light tracking-tight transition-colors duration-200 ${isActive(cat.slug)
                          ? 'text-black dark:text-white'
                          : 'text-neutral-400 hover:text-black dark:text-neutral-600 dark:hover:text-white'
                          }`}
                      >
                        {cat.label}
                      </Link>
                    </div>

                    {/* Subcategories */}
                    {categoryTree[cat.slug] && (
                      <ul className="mt-4 ml-4 space-y-3 border-l border-neutral-100 pl-4 dark:border-neutral-800">
                        {categoryTree[cat.slug].map((sub) => (
                          <li key={sub.slug}>
                            <Link
                              href={`/${locale}/shop?category=${sub.slug}`}
                              className={`block text-[13px] font-light transition-colors duration-200 ${activeSlug === sub.slug
                                ? 'text-black dark:text-white'
                                : 'text-neutral-500 hover:text-black dark:text-neutral-400 dark:hover:text-white'
                                }`}
                            >
                              {sub.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            {/* Bottom Section (Thumb Zone) */}
            <div className="mt-auto pt-8 border-t border-neutral-100 dark:border-neutral-800">
              <div className="flex items-center justify-between mb-8">
                <p className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                  Theme
                </p>
                <ThemeToggle />
              </div>

              <p className="text-[10px] uppercase tracking-[0.1em] text-neutral-300 dark:text-neutral-700">
                Swiss Premium Quality
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Fallback – renders nav skeleton while searchParams resolves (SSR boundary)
// ---------------------------------------------------------------------------

function NavFallback({ categories, locale }: Props) {
  return (
    <>
      <nav className="hidden items-center gap-7 lg:flex" aria-hidden="true">
        <span className="text-[11px] font-light tracking-[0.1em] text-neutral-400">
          {locale === 'en' ? 'ALL' : 'ALLE'}
        </span>
        {categories.map((cat) => (
          <span
            key={cat.slug}
            className="whitespace-nowrap text-[11px] font-light tracking-[0.1em] text-neutral-400"
          >
            {cat.name.toUpperCase()}
          </span>
        ))}
      </nav>
      {/* Reserve space for ThemeToggle + burger */}
      <div className="flex items-center gap-3">
        <div className="h-8 w-8" />
        <div className="h-8 w-8 lg:hidden" />
      </div>
    </>
  );
}

// ---------------------------------------------------------------------------
// Icons
// ---------------------------------------------------------------------------

function BurgerOpen() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
}

function BurgerClose() {
  return (
    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// Public export – wraps inner component in Suspense (Next.js 15 requirement)
// ---------------------------------------------------------------------------

export function Navigation({ categories, locale }: Props) {
  return (
    <Suspense fallback={<NavFallback categories={categories} locale={locale} />}>
      <NavContent categories={categories} locale={locale} />
    </Suspense>
  );
}
