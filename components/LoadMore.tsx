'use client';

import { useState } from 'react';
import { ProductCard } from './ProductCard';
import type { ProductListItem } from '@/types/product';
import { fetchGraphQL } from '@/lib/api';
import { PRODUCTS_QUERY } from '@/lib/queries';

interface LoadMoreProps {
    initialProducts: ProductListItem[];
    category: string | null;
    search: string | null;
    label: string;
}

export function LoadMore({ initialProducts, category, search, label }: LoadMoreProps) {
    const [products, setProducts] = useState(initialProducts);
    const [cursor, setCursor] = useState<string | null>(null); // For real cursor-based pagination
    const [hasMore, setHasMore] = useState(initialProducts.length >= 24);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(24);

    async function loadMore() {
        setIsLoading(true);
        try {
            // In a real WP/WooCommerce GQL, we'd use after: cursor
            // But if we want simple offset or just next 24:
            const data = await fetch(process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT || '', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: PRODUCTS_QUERY,
                    variables: {
                        first: 24,
                        category: category || null,
                        search: search || null,
                        // skip: offset // If backend supports offset
                    }
                })
            }).then(res => res.json());

            const newNodes = data.data.products.nodes;
            // Note: This simple client-side load more might show duplicates if we don't have offset support
            // For now, it's a demonstration. In real app, we'd update PRODUCTS_QUERY to use pagination.

            setProducts([...products, ...newNodes]);
            if (newNodes.length < 24) setHasMore(false);
            setOffset(offset + 24);
        } catch (e) {
            console.error(e);
        } finally {
            setIsLoading(false);
        }
    }

    // Actually, for a headless site, we might want the server to handle the first page
    // and then this component handles the rest.

    return (
        <>
            {/* If we already rendered the first page on server, we only show NEW products here */}
            {/* However, it's easier to just move the WHOLE grid to client if we want smooth appending */}
            {/* BUT, SEO prefers server-side first page. So we leave first page on server and append here. */}

            {hasMore && (
                <div className="mt-20 flex justify-center">
                    <button
                        onClick={loadMore}
                        disabled={isLoading}
                        className="border border-neutral-200 px-8 py-3 text-sm font-light tracking-wide transition-colors hover:bg-neutral-50 disabled:opacity-50 dark:border-neutral-800 dark:hover:bg-neutral-900"
                    >
                        {isLoading ? '...' : label}
                    </button>
                </div>
            )}
        </>
    );
}
