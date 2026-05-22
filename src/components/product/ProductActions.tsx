"use client";

import { useRouter } from "next/navigation";
import { useCartStore } from "@/store/cart";
import type { ProductDTO } from "@/types";

export default function ProductActions({ product }: { product: ProductDTO }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const cartPayload = {
    productId: product._id,
    slug: product.slug,
    title: product.title,
    price: product.price,
    image: product.images[0]?.url || "/images/icons/placeholder.svg",
    stock: product.stock,
  };

  const handleAddToCart = () => {
    addItem(cartPayload);
  };

  const handleBuyNow = () => {
    addItem(cartPayload);
    router.push("/cart");
  };

  const outOfStock = product.stock < 1;

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={handleAddToCart}
        disabled={outOfStock}
        className="h-12 flex-1 rounded border border-brand-dark bg-white text-sm font-semibold uppercase tracking-wide text-brand-dark transition-colors hover:bg-brand-dark hover:text-white disabled:opacity-50"
      >
        Add to Cart
      </button>
      <button
        type="button"
        onClick={handleBuyNow}
        disabled={outOfStock}
        className="h-12 flex-1 rounded bg-brand-dark text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gray-800 disabled:opacity-50"
      >
        Buy Now
      </button>
    </div>
  );
}
