// Server Component – no interactivity needed
import Link from 'next/link';

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-neutral-100 py-0 transition-colors duration-300 dark:border-neutral-800">
      <div className="flex flex-col lg:flex-row lg:items-center">
        {/* Text Content */}
        <div className="z-10 bg-white px-6 py-24 transition-colors duration-300 dark:bg-neutral-950 lg:w-1/2 lg:py-32 lg:pr-20">
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
            Premium Cannabis
          </p>

          <h1 className="mb-6 text-5xl font-light leading-[1.08] tracking-tight text-black transition-colors duration-300 dark:text-white md:text-6xl lg:text-[4.5rem]">
            Curated for{' '}
            <em className="font-light not-italic text-neutral-400 dark:text-neutral-500">
              connoisseurs
            </em>
            .
          </h1>

          <p className="mb-12 max-w-sm text-sm font-light leading-relaxed text-neutral-500 transition-colors duration-300 dark:text-neutral-400">
            Wyselekcjonowane produkty premium dla tych, którzy cenią jakość
            i&nbsp;wyjątkowy smak.
          </p>

          <Link
            href="/shop"
            className="inline-block border border-black px-12 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-black hover:text-white dark:border-neutral-200 dark:text-neutral-200 dark:hover:bg-white dark:hover:text-black"
          >
            Shop Now
          </Link>
        </div>

        {/* Hero Visual - Responsive Aspect Ratio */}
        <div className="relative aspect-[9/16] w-full bg-neutral-50 dark:bg-neutral-900 lg:aspect-[16/9] lg:w-1/2">
          {/* Placeholder for Hero Image - In a real app we'd use next/image here */}
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[10px] uppercase tracking-[0.5em] text-neutral-200 dark:text-neutral-800">
              Visual Narrative
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
