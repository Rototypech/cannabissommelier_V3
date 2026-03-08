import { Suspense } from 'react';
import type { Metadata } from 'next';
import { fetchGraphQL } from '@/lib/api';
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from '@/lib/queries';
import { ProductCard } from '@/components/ProductCard';
import { ProductSkeletonGrid } from '@/components/ProductSkeleton';
import { SidebarFilters } from '@/components/SidebarFilters';
import type { ProductListItem, Category } from '@/types/product';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ProductsData {
  products: { nodes: ProductListItem[] };
}

interface CategoriesData {
  productCategories: { nodes: Category[] };
}

// ---------------------------------------------------------------------------
// Metadata – dynamic title based on category
// ---------------------------------------------------------------------------

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}): Promise<Metadata> {
  const { category } = await searchParams;
  return {
    title: category
      ? `${category.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}`
      : 'Sklep',
  };
}

// ---------------------------------------------------------------------------
// Product grid – separate async Server Component for Suspense streaming
// ---------------------------------------------------------------------------

async function ProductGrid({ category }: { category: string | null }) {
  const data = await fetchGraphQL<ProductsData>(
    PRODUCTS_QUERY,
    { first: 48, ...(category ? { category } : {}) },
    60
  );

  const products = data.products.nodes;

  if (products.length === 0) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm font-light text-neutral-400">
          Brak produktów w tej kategorii.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product.databaseId} product={product} />
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page – Next.js 15: searchParams is a Promise
// ---------------------------------------------------------------------------

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const activeCategory = category ?? null;

  // Categories: short query, cached 1h – sidebar renders immediately
  const categoriesData = await fetchGraphQL<CategoriesData>(
    CATEGORIES_QUERY,
    undefined,
    3600
  );
  const categories = categoriesData.productCategories.nodes;

  const pageTitle = activeCategory
    ? (categories.find((c) => c.slug === activeCategory)?.name ?? 'Produkty')
    : 'Wszystkie produkty';

  return (
    <div className="py-12">
      {/* Section heading */}
      <div className="mb-10">
        <h1 className="text-2xl font-light tracking-tight text-black transition-colors duration-300 dark:text-white">
          {pageTitle}
        </h1>
        {activeCategory && (
          <p className="mt-1 text-xs font-light text-neutral-400">
            Filtrowanie według kategorii
          </p>
        )}
      </div>

      {/* Layout: sidebar + streaming product grid */}
      <div className="flex gap-12">
        <SidebarFilters categories={categories} activeSlug={activeCategory} />

        <div className="min-w-0 flex-1">
          {/* Skeleton shown instantly; ProductGrid streams when data is ready */}
          <Suspense fallback={<ProductSkeletonGrid />}>
            <ProductGrid category={activeCategory} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
