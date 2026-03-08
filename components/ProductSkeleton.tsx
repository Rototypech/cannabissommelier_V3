// Imituje kształt ProductCard podczas ładowania danych

function ProductSkeleton() {
  return (
    <div className="block" aria-hidden="true">
      <div className="aspect-[4/5] w-full animate-pulse bg-neutral-100" />
      <div className="mt-3 space-y-2">
        <div className="h-[13px] w-3/4 animate-pulse rounded-sm bg-neutral-100" />
        <div className="h-[13px] w-1/4 animate-pulse rounded-sm bg-neutral-100" />
      </div>
    </div>
  );
}

export function ProductSkeletonGrid() {
  return (
    <div
      className="grid grid-cols-2 gap-x-4 gap-y-10 sm:grid-cols-3 lg:grid-cols-4"
      aria-label="Ładowanie produktów…"
    >
      {Array.from({ length: 8 }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
