import ProductCard from "@/components/product/ProductCard";
import type { ProductDTO } from "@/types/server";

export default function RelatedProducts({
  products,
}: {
  products: ProductDTO[];
}) {
  if (!products.length) return null;

  return (
    <section className="mt-16 border-t border-gray-200 pt-12" aria-labelledby="related-heading">
      <h2
        id="related-heading"
        className="mb-8 text-center text-2xl font-light uppercase tracking-wider text-brand-gray after:mx-auto after:mt-3 after:block after:h-px after:w-24 after:bg-gray-300 lg:text-3xl"
      >
        You May Also Like
      </h2>
      <div className="grid grid-cols-2 place-items-center gap-6 md:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p._id} product={p} />
        ))}
      </div>
    </section>
  );
}
