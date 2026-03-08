import Image from 'next/image';
import Link from 'next/link';

export function Hero({ dict, locale }: { dict: any; locale: string }) {
  return (
    <section className="relative overflow-hidden border-b border-neutral-100 py-0 transition-colors duration-300 dark:border-neutral-800">
      <div className="flex flex-col lg:flex-row lg:items-center">
        {/* Text Content */}
        <div className="z-10 bg-white px-6 py-24 transition-colors duration-300 dark:bg-neutral-950 lg:w-1/2 lg:py-32 lg:pr-20">
          <p className="mb-5 text-[10px] font-medium uppercase tracking-[0.3em] text-neutral-400 dark:text-neutral-500">
            Premium Cannabis
          </p>

          <h1 className="mb-6 text-5xl font-light leading-[1.08] tracking-tight text-black transition-colors duration-300 dark:text-white md:text-6xl lg:text-[4.5rem]">
            {dict.hero.title.split(' ').map((word: string, i: number) => (
              i === dict.hero.title.split(' ').length - 1 ? (
                <em key={i} className="font-light not-italic text-neutral-400 dark:text-neutral-500">
                  {word}
                </em>
              ) : (
                <span key={i}>{word} </span>
              )
            ))}
            .
          </h1>

          <p className="mb-12 max-w-sm text-sm font-light leading-relaxed text-neutral-500 transition-colors duration-300 dark:text-neutral-400">
            {dict.hero.subtitle}
          </p>

          <Link
            href={`/${locale}/shop`}
            className="inline-block border border-black px-12 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-black transition-all hover:bg-black hover:text-white dark:border-neutral-200 dark:text-neutral-200 dark:hover:bg-white dark:hover:text-black"
          >
            {dict.hero.cta}
          </Link>
        </div>

        <div className="relative aspect-[9/16] w-full bg-neutral-50 dark:bg-neutral-900 lg:aspect-[16/9] lg:w-1/2">
          <Image
            src="/images/hero.jpg"
            alt="Cannabis Sommelier Hero"
            fill
            priority
            className="object-cover transition-opacity duration-700 hover:opacity-90"
          />
          <div className="absolute inset-0 bg-black/0 dark:bg-black/10" />
        </div>
      </div>
    </section>
  );
}
