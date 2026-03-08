'use client';

import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import type { Category } from '@/types/product';

interface SidebarFiltersProps {
  categories: Category[];
  activeSlug: string | null;
  locale: 'en' | 'de';
  allLabel: string;
  dict: any;
}

export function SidebarFilters({ categories, activeSlug, locale, allLabel, dict }: SidebarFiltersProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  function navigate(slug: string | null) {
    const params = new URLSearchParams(window.location.search);
    if (slug) {
      params.set('category', slug);
    } else {
      params.delete('category');
    }
    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  }

  // Group categories by parent
  const categoryTree = categories.reduce((acc, cat) => {
    const parentSlug = cat.parent?.node.slug || 'root';
    if (!acc[parentSlug]) acc[parentSlug] = [];
    acc[parentSlug].push(cat);
    return acc;
  }, {} as Record<string, Category[]>);

  // Top-level categories (those whose parent is 'root' or not in our list)
  const rootCategories = categories.filter(c => !c.parent || !categories.find(p => p.slug === c.parent?.node.slug));

  const items = (
    <ul className="space-y-0.5" role="list">
      <li>
        <button
          onClick={() => navigate(null)}
          className={`w-full rounded px-2 py-1.5 text-left text-sm transition-colors duration-150 ${!activeSlug
            ? 'font-medium text-black dark:text-white'
            : 'font-light text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white'
            }`}
        >
          {allLabel}
        </button>
      </li>

      {rootCategories.map((cat) => (
        <li key={cat.databaseId}>
          <button
            onClick={() => navigate(cat.slug)}
            className={`w-full rounded px-2 py-1.5 text-left text-sm transition-colors duration-150 ${activeSlug === cat.slug
              ? 'font-medium text-black dark:text-white'
              : 'font-light text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white'
              }`}
          >
            {cat.name}
            {cat.count !== null && (
              <span className="ml-1.5 text-[10px] opacity-30">
                ({cat.count})
              </span>
            )}
          </button>

          {/* Subcategories */}
          {categoryTree[cat.slug] && (
            <ul className="ml-4 mt-0.5 border-l border-neutral-100 pl-2 dark:border-neutral-800">
              {categoryTree[cat.slug].map((sub) => (
                <li key={sub.databaseId}>
                  <button
                    onClick={() => navigate(sub.slug)}
                    className={`w-full rounded px-2 py-1 text-left text-[13px] transition-colors duration-150 ${activeSlug === sub.slug
                      ? 'font-medium text-black dark:text-white'
                      : 'font-light text-neutral-400 hover:text-black dark:text-neutral-500 dark:hover:text-white'
                      }`}
                  >
                    {sub.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* ── Mobile: przycisk + rozwijany panel ── */}
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="mb-6 flex items-center gap-2 rounded-full border border-neutral-200 px-4 py-2 text-sm font-light tracking-wide text-neutral-700 transition-colors hover:border-neutral-400 hover:text-black"
          aria-expanded={isOpen}
        >
          <IconFilter className="h-3.5 w-3.5" />
          {dict.common.filter}
          {activeSlug && (
            <span className="ml-0.5 h-1.5 w-1.5 rounded-full bg-black" />
          )}
        </button>

        {isOpen && (
          <div className="mb-8 rounded-xl border border-neutral-100 p-4">
            {items}
          </div>
        )}
      </div>

      {/* ── Desktop: sticky sidebar ── */}
      <aside className="hidden w-44 shrink-0 lg:block">
        <p className="mb-4 text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-400">
          {dict.common.categories}
        </p>
        {items}
      </aside>
    </>
  );
}

function IconFilter({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M3 4h18M7 12h10M11 20h2"
      />
    </svg>
  );
}
