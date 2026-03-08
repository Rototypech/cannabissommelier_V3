import Image from 'next/image';
import Link from 'next/link';
import type { ProductListItem } from '@/types/product';

interface ProductCardProps {
  product: ProductListItem;
  locale: string;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const { slug, name, price, featuredImage } = product;
  const imageUrl = featuredImage?.node.sourceUrl ?? null;
  const imageAlt = featuredImage?.node.altText || name;

  return (
    <Link href={`/${locale}/product/${slug}`} className="group block">
      {/* Image container – 4:5 portrait ratio */}
      <div className="relative aspect-[4/5] overflow-hidden bg-neutral-50 dark:bg-neutral-900">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          // Elegancki placeholder zamiast tekstu
          <div className="flex h-full w-full items-center justify-center bg-neutral-100 dark:bg-neutral-800">
            <svg
              className="h-10 w-10 text-neutral-300 dark:text-neutral-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Meta */}
      <div className="mt-3 space-y-0.5">
        <h3 className="text-[13px] font-light leading-snug tracking-wide text-neutral-800 transition-colors duration-200 group-hover:text-black line-clamp-2 dark:text-neutral-100 dark:group-hover:text-white">
          {name}
        </h3>
        {price && (
          <div className="flex flex-col">
            <p
              className="text-[13px] font-normal text-neutral-800 dark:text-neutral-200"
              dangerouslySetInnerHTML={{ __html: price }}
            />
            {product.unitPrice?.[0]?.value && (
              <p className="text-[10px] font-light text-neutral-400 dark:text-neutral-500">
                {product.unitPrice[0].value}
              </p>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
