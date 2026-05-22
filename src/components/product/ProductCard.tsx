"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { ProductDTO } from "@/types";
import { useCartStore } from "@/store/cart";

export default function ProductCard({ product }: { product: ProductDTO }) {
  const router = useRouter();
  const addItem = useCartStore((s) => s.addItem);

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      productId: product._id,
      slug: product.slug,
      title: product.title,
      price: product.price,
      image: product.images[0]?.url || "/images/icons/placeholder.svg",
      stock: product.stock,
    });
    router.push("/cart");
  };

  const imageUrl = product.images[0]?.url || "/images/icons/placeholder.svg";

  return (
    <article className="group flex w-full max-w-[280px] flex-col items-center pt-2 border border-gray-200 rounded-lg">
      <Link
        href={`/product/${product.slug}`}
        className="flex w-full flex-col items-center"
      >
        <div className="relative aspect-square w-[calc(100%-15px)]">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 280px"
            className="rounded-md object-cover"
          />
        </div>

        <div className="relative flex w-full flex-col items-center pb-1">
          {/* <div className="pointer-events-none absolute bottom-0 left-0 z-10 h-[calc(100%+35px)] w-full rounded-md border border-gray-300 transition-colors duration-500 group-hover:border-accent" /> */}
          <div className="relative z-20 flex w-full flex-col items-center overflow-hidden bg-white/80 pt-1 backdrop-blur-sm">
            <h2 className="my-2 w-full truncate px-2 text-center text-xs font-normal uppercase text-brand-gray md:text-sm">
              {product.title}
            </h2>
            <p className="text-sm font-semibold text-brand-dark">
              ৳{product.price.toLocaleString()}
            </p>
          </div>
        </div>
      </Link>

      <button
        type="button"
        onClick={handleBuyNow}
        disabled={product.stock < 1}
        className="relative z-20 mt-2 h-10 w-full rounded-b-sm bg-green-700 text-xs text-white transition-colors hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
      >
        {product.stock < 1 ? "OUT OF STOCK" : "BUY NOW"}
      </button>
    </article>
  );
}
