'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { useTransition, useEffect, useState } from 'react';

export function SearchBar({ placeholder }: { placeholder: string }) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const [isPending, startTransition] = useTransition();
    const [value, setValue] = useState(searchParams.get('search') ?? '');

    function handleSearch(term: string) {
        const params = new URLSearchParams(searchParams);
        if (term) {
            params.set('search', term);
        } else {
            params.delete('search');
        }

        // Reset category when searching globally? Or keep it? 
        // Usually search is global, but let's keep category if it exists of the user wants to filter within category.
        // However, the query where: {category, search} works as an AND.

        startTransition(() => {
            router.push(`${pathname}?${params.toString()}`);
        });
    }

    // Sync internal state with URL (e.g. back button)
    useEffect(() => {
        setValue(searchParams.get('search') ?? '');
    }, [searchParams]);

    return (
        <div className="relative">
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                    // Debounce could be added, but for now just direct or onEnter
                }}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSearch(value);
                }}
                placeholder={placeholder}
                className="h-10 w-full rounded-none border-b border-neutral-200 bg-transparent px-0 text-sm font-light transition-colors focus:border-black focus:outline-none dark:border-neutral-800 dark:focus:border-white"
            />
            {isPending && (
                <div className="absolute right-0 top-1/2 -translate-y-1/2">
                    <div className="h-3 w-3 animate-spin rounded-full border border-neutral-300 border-t-black" />
                </div>
            )}
        </div>
    );
}
