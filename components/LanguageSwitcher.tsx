'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function LanguageSwitcher({ currentLocale }: { currentLocale: 'en' | 'de' }) {
    const pathname = usePathname();

    // Replace the current locale in the path with the target locale
    const getPath = (targetLocale: string) => {
        if (!pathname) return `/${targetLocale}`;
        const segments = pathname.split('/');
        segments[1] = targetLocale;
        return segments.join('/');
    };

    return (
        <div className="flex items-center gap-3 text-[10px] font-medium tracking-[0.15em] uppercase text-neutral-400">
            <Link
                href={getPath('de')}
                className={`transition-colors hover:text-black dark:hover:text-white ${currentLocale === 'de' ? 'text-black dark:text-white' : ''
                    }`}
            >
                DE
            </Link>
            <span className="h-3 w-[1px] bg-neutral-100 dark:bg-neutral-800" />
            <Link
                href={getPath('en')}
                className={`transition-colors hover:text-black dark:hover:text-white ${currentLocale === 'en' ? 'text-black dark:text-white' : ''
                    }`}
            >
                EN
            </Link>
        </div>
    );
}
