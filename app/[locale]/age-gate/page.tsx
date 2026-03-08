'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState, use } from 'react';
import Image from 'next/image';

export default function AgeGatePage({ params }: { params: Promise<{ locale: string }> }) {
    const router = useRouter();
    const { locale } = use(params);
    const [dict, setDict] = useState<any>(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        import(`@/dictionaries/${locale}.json`).then(m => setDict(m.default));
    }, [locale]);

    function verifyAge() {
        // Set cookie for 30 days
        document.cookie = 'age_verified=true; path=/; max-age=' + 30 * 24 * 60 * 60;
        router.refresh();
        router.push(`/${locale}`);
    }

    if (!dict) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white transition-colors duration-300 dark:bg-neutral-950">
            <div className="max-w-md px-6 text-center">
                <div className="mb-12 flex justify-center">
                    <Image
                        src="/images/logo_cs_white.svg"
                        alt="Cannabis Sommelier"
                        width={180}
                        height={40}
                        priority
                        className="block h-10 w-auto dark:hidden"
                    />
                    <Image
                        src="/images/logo_cs_black.png"
                        alt="Cannabis Sommelier"
                        width={180}
                        height={40}
                        priority
                        className="hidden h-10 w-auto dark:block"
                    />
                </div>

                <h1 className="mb-4 text-2xl font-light tracking-tight text-black dark:text-white">
                    {dict.ageGate.title}
                </h1>
                <p className="mb-10 text-sm font-light leading-relaxed text-neutral-500 dark:text-neutral-400">
                    {dict.ageGate.description}
                </p>

                <div className="space-y-4">
                    <button
                        onClick={verifyAge}
                        className="w-full border border-black bg-black py-4 text-xs font-medium uppercase tracking-[0.2em] text-white transition-all hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
                    >
                        {dict.ageGate.yes}
                    </button>
                    <button
                        onClick={() => setError(true)}
                        className="w-full border border-neutral-200 py-4 text-xs font-medium uppercase tracking-[0.2em] text-neutral-400 transition-colors hover:border-black hover:text-black dark:border-neutral-800 dark:text-neutral-600 dark:hover:border-neutral-400 dark:hover:text-neutral-400"
                    >
                        {dict.ageGate.no}
                    </button>
                </div>

                {error && (
                    <p className="mt-6 text-xs font-light text-red-500">
                        Przykro nam, ale musisz być pełnoletni, aby odwiedzić tę stronę.
                    </p>
                )}
            </div>
        </div>
    );
}
