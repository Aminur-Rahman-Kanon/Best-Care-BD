import HeroCarousel from "@/components/home/HeroCarousel";
import ProductGrid from "@/components/home/ProductGrid";
import { getProducts } from "@/lib/products";

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function HomePage({ searchParams }: HomeProps) {
  const { q } = await searchParams;
  const search = q?.trim() || "";

  let products: Awaited<ReturnType<typeof getProducts>>["products"] = [];
  let hasMore = false;

  try {
    const productData = await getProducts(1, 12, search || undefined);
    products = productData.products;
    hasMore = productData.hasMore;
  } catch {
    // Build/startup without DB — render empty state
  }

  return (
    <>
      <HeroCarousel />
      <ProductGrid
        initialProducts={products}
        initialHasMore={hasMore}
        search={search}
      />
    </>
  );
}
