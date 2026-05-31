"use client";

import { useState } from "react";
import ProductCard from "@/components/product/ProductCard";
import type { ProductDTO } from "@/types/server";

interface ProductGridProps {
  initialProducts: ProductDTO[];
  initialHasMore: boolean;
  search?: string;
}

export default function ProductGrid({
  initialProducts,
  initialHasMore,
  search = "",
}: ProductGridProps) {
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);

  const loadMore = async () => {
    setLoading(true);
    const nextPage = page + 1;
    const params = new URLSearchParams({
      page: String(nextPage),
      limit: "12",
    });
    if (search) params.set("search", search);

    const res = await fetch(`/api/products?${params}`);
    const data = await res.json();
    setProducts((prev) => [...prev, ...data.products]);
    setPage(nextPage);
    setHasMore(data.hasMore);
    setLoading(false);
  };

  if (!products.length) {
    return (
      <p className="py-20 text-center text-brand-gray">
        {search ? `No products found for "${search}"` : "No products available yet."}
      </p>
    );
  }

  return (
    <section aria-label="Products" className="w-full">
      <div className="mx-auto grid max-w-[1400px] grid-cols-2 place-items-center gap-x-3 gap-y-12 px-3 py-10 md:grid-cols-4 md:gap-x-4 lg:gap-y-16">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="flex justify-center pb-16">
          <button
            type="button"
            onClick={loadMore}
            disabled={loading}
            className="h-10 w-full max-w-[220px] rounded border border-brand-dark bg-white text-xs uppercase tracking-wider text-brand-dark transition-colors hover:bg-brand-dark hover:text-white disabled:opacity-50 sm:text-sm"
          >
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      )}
    </section>
  );
}
