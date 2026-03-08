import { Suspense } from 'react';
import { fetchGraphQL } from '@/lib/api';
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from '@/lib/queries';
import { SearchBar } from '@/components/SearchBar';
import { LoadMore } from '@/components/LoadMore';
import { ProductCard } from '@/components/ProductCard';
import { ProductSkeletonGrid } from '@/components/ProductSkeleton';
import { SidebarFilters } from '@/components/SidebarFilters';
import { getDictionary } from '@/lib/get-dictionary';
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

interface ShopProps {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ category?: string; search?: string }>;
}

// ---------------------------------------------------------------------------
// Inner Server Component – wraps the product grid so Suspense can stream it
// ---------------------------------------------------------------------------

async function ProductGrid({
    category,
    search,
    dict,
    locale
}: {
    category: string | null;
    search: string | null;
    dict: any;
    locale: string;
}) {
    let products: ProductListItem[] = [];
    let errorMsg: string | null = null;
    try {
        const data = await fetchGraphQL<ProductsData>(
            PRODUCTS_QUERY,
            {
                first: 24,
                category: category || null,
                search: search || null
            },
            60
        );
        products = data.products.nodes;
    } catch (error) {
        errorMsg = error instanceof Error ? error.message : 'Unknown error';
        console.error('Failed to fetch products for Shop ProductGrid:', errorMsg);
    }

    if (errorMsg) {
        return (
            <div className="py-16 text-center">
                <p className="text-sm font-light text-red-500/70">
                    Unable to connect to product source: {errorMsg}
                </p>
            </div>
        );
    }

    if (products.length === 0) {
        return (
            <p className="py-16 text-center text-sm font-light text-neutral-400">
                {dict.common.noProducts}
            </p>
        );
    }

    return (
        <>
            <div className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
                {products.map((product: ProductListItem) => (
                    <ProductCard key={product.databaseId} product={product} locale={locale} />
                ))}
            </div>

            <LoadMore
                initialProducts={products}
                category={category}
                search={search}
                label={dict.common.loadMore}
            />
        </>
    );
}

// ---------------------------------------------------------------------------
// Page – Next.js 15: params/searchParams are Promises
// ---------------------------------------------------------------------------

export default async function ShopPage({ params, searchParams }: ShopProps) {
    const { locale } = await params;
    const { category, search } = await searchParams;
    const activeCategory = category ?? null;
    const activeSearch = search ?? null;

    const dict = await getDictionary(locale as 'en' | 'de');

    // Categories load fast – no Suspense needed, sidebar appears immediately
    let categories: Category[] = [];
    try {
        const categoriesData = await fetchGraphQL<CategoriesData>(
            CATEGORIES_QUERY,
            undefined,
            3600
        );
        categories = categoriesData.productCategories.nodes;
    } catch (error) {
        console.error('Failed to fetch categories for ShopPage:', error);
    }

    return (
        <div className="pt-12">
            {/* Header & Search */}
            <div className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div className="min-w-0">
                    <h2 className="truncate text-2xl font-light tracking-tight text-black transition-colors duration-300 dark:text-white">
                        {activeCategory
                            ? (categories.find((c) => c.slug === activeCategory)?.name ?? dict.common.allProducts)
                            : activeSearch
                                ? `${dict.common.search.replace('...', '')}: ${activeSearch}`
                                : dict.common.allProducts}
                    </h2>
                </div>

                <div className="w-full sm:w-64">
                    <SearchBar placeholder={dict.common.search} />
                </div>
            </div>

            {/* Shop layout: sidebar + grid */}
            <div className="flex flex-col gap-12 lg:flex-row">
                <SidebarFilters
                    categories={categories}
                    activeSlug={activeCategory}
                    locale={locale as 'en' | 'de'}
                    allLabel={dict.common.all}
                    dict={dict}
                />

                {/* Product grid streams in while sidebar is already visible */}
                <div className="min-w-0 flex-1">
                    <Suspense fallback={<ProductSkeletonGrid />}>
                        <ProductGrid
                            category={activeCategory}
                            search={activeSearch}
                            dict={dict}
                            locale={locale}
                        />
                    </Suspense>
                </div>
            </div>
        </div>
    );
}
