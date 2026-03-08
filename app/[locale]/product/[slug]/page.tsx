import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { fetchGraphQL } from '@/lib/api';
import { PRODUCT_QUERY, SLUGS_QUERY } from '@/lib/queries';
import { ComplianceWrapper } from '@/components/ComplianceWrapper';
import { getDictionary } from '@/lib/get-dictionary';
import type { Product } from '@/types/product';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SlugsData {
  products: { nodes: Array<{ slug: string }> };
}

interface ProductData {
  product: Product | null;
}

// ---------------------------------------------------------------------------
// Static params + ISR
// ---------------------------------------------------------------------------

export async function generateStaticParams() {
  // Return empty to avoid build-time backend stress/encoding issues.
  // All pages will be generated on-demand via ISR.
  return [];
}

export const revalidate = 60;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StockBadge({ status, dict }: { status?: string | null; dict: any }) {
  if (!status) return null;
  const inStock = status === 'IN_STOCK';
  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-[11px] font-medium tracking-wide ${inStock
        ? 'bg-neutral-100 text-neutral-700'
        : 'bg-red-50 text-red-500'
        }`}
    >
      {inStock ? dict.common.inStock : dict.common.outOfStock}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page – Next.js 15: params is a Promise
// ---------------------------------------------------------------------------

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const dict = await getDictionary(locale as 'en' | 'de');

  let product: Product | null = null;
  let errorMsg: string | null = null;

  try {
    const data = await fetchGraphQL<ProductData>(PRODUCT_QUERY, { slug }, 60, true);
    product = data.product;
  } catch (error) {
    errorMsg = error instanceof Error ? error.message : 'Unknown error';
    console.error('Failed to fetch product:', errorMsg);
  }

  if (errorMsg) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="mb-6 text-sm font-light text-red-500/70">
          Unable to load product: {errorMsg}
        </p>
        <Link
          href={`/${locale}/shop`}
          className="text-xs font-light tracking-wide text-neutral-400 underline underline-offset-4 hover:text-black"
        >
          {dict.common.backToShop}
        </Link>
      </div>
    );
  }

  if (!product) notFound();

  const imageUrl = product.featuredImage?.node.sourceUrl ?? null;
  const imageAlt = product.featuredImage?.node.altText || product.name;

  const price =
    product.__typename === 'SimpleProduct' ||
      product.__typename === 'VariableProduct' ||
      product.__typename === 'ExternalProduct'
      ? product.price
      : null;

  const stockStatus =
    product.__typename === 'SimpleProduct' ? product.stockStatus : null;

  const externalUrl =
    product.__typename === 'ExternalProduct' ? product.externalUrl : null;

  const variations =
    product.__typename === 'VariableProduct'
      ? (product.variations?.nodes ?? [])
      : [];

  return (
    <>
      {/* Back */}
      {/* Back */}
      <Link
        href={`/${locale}/shop`}
        className="mb-10 inline-flex items-center gap-1.5 text-xs font-light tracking-wide text-neutral-400 transition-colors hover:text-black dark:text-neutral-500 dark:hover:text-white"
      >
        <span aria-hidden="true">←</span>
        {dict.common.backToShop}
      </Link>

      <div className="grid gap-12 lg:grid-cols-2">
        {/* ... (Image section unchanged) */}

        {/* ── Details ── */}
        <div className="flex flex-col gap-6 py-2">
          <h1 className="text-2xl font-light leading-snug tracking-tight text-black dark:text-white">
            {product.name}
          </h1>

          {price && (
            <div className="flex flex-col gap-1">
              <p
                className="text-base font-light text-neutral-500 dark:text-neutral-400"
                dangerouslySetInnerHTML={{ __html: price }}
              />
              <ComplianceWrapper
                unitPrice={product.unitPrice?.[0]?.value}
                legalNotes={product.legalNotes?.[0]?.value}
              />
            </div>
          )}

          <StockBadge status={stockStatus} dict={dict} />

          {product.description && (
            <div
              className="text-sm font-light leading-relaxed text-neutral-500 dark:text-neutral-400 [&_p]:mb-3 [&_strong]:font-medium [&_strong]:text-neutral-700 dark:[&_strong]:text-neutral-300"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}

          {/* Warianty */}
          {variations.length > 0 && (
            <div className="border-t border-neutral-100 pt-6 dark:border-neutral-800">
              <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-400">
                {dict.common.variants}
              </p>
              <ul className="space-y-2">
                {variations.map((v) => (
                  <li
                    key={v.name}
                    className="flex items-center justify-between border-b border-neutral-50 py-2.5 dark:border-neutral-900"
                  >
                    <span className="text-sm font-light text-neutral-700 dark:text-neutral-300">
                      {v.name}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        {v.price && (
                          <span
                            className="block text-sm text-neutral-500 dark:text-neutral-400"
                            dangerouslySetInnerHTML={{ __html: v.price }}
                          />
                        )}
                        <ComplianceWrapper unitPrice={v.unitPrice?.[0]?.value} className="opacity-70" />
                      </div>
                      <StockBadge status={v.stockStatus} dict={dict} />
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Checkout CTA - Desktop (Visible) / Mobile (Hidden in normal flow, replaced by sticky) */}
          <div className="mt-4 hidden lg:block">
            {externalUrl ? (
              <a
                href={externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block border border-black bg-black px-12 py-4 text-sm font-medium uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
              >
                {dict.common.buyNow}
              </a>
            ) : (
              <button
                className="inline-block border border-black bg-black px-12 py-4 text-sm font-medium uppercase tracking-widest text-white transition-all hover:bg-white hover:text-black dark:border-white dark:bg-white dark:text-black dark:hover:bg-neutral-950 dark:hover:text-white"
              >
                {dict.common.addToCart}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* ── Mobile Sticky CTA (Thumb Zone) ── */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-neutral-100 bg-white/80 p-4 backdrop-blur-lg transition-colors duration-300 dark:border-neutral-800 dark:bg-neutral-950/80 lg:hidden">
        <div className="mx-auto max-w-7xl">
          {externalUrl ? (
            <a
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-14 w-full items-center justify-center bg-black px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white dark:bg-white dark:text-black"
            >
              {dict.common.buyNow} — {price ? <span className="ml-2 opacity-60" dangerouslySetInnerHTML={{ __html: price }} /> : ''}
            </a>
          ) : (
            <button
              className="flex h-14 w-full items-center justify-center bg-black px-6 text-[11px] font-bold uppercase tracking-[0.2em] text-white dark:bg-white dark:text-black"
            >
              {dict.common.addToCart} — {price ? <span className="ml-2 opacity-60" dangerouslySetInnerHTML={{ __html: price }} /> : ''}
            </button>
          )}
        </div>
      </div>

      {/* Spacer for sticky CTA */}
      <div className="h-24 lg:hidden" />
    </>
  );
}
