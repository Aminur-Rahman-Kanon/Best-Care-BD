import HeroCarousel from "@/components/home/HeroCarousel";
import ProductGrid from "@/components/home/ProductGrid";
import { getProducts } from "@/lib/products";
import { connectDB } from "@/lib/mongodb";
import Banner from "@/models/Banner";
import type { BannerDTO } from "@/types";

interface HomeProps {
  searchParams: Promise<{ q?: string }>;
}

async function getBanners(): Promise<BannerDTO[]> {
  try {
    await connectDB();
    const docs = await Banner.find({ active: true }).sort({ order: 1 }).lean();
    return docs.map((b) => ({
      _id: String(b._id),
      title: b.title as string,
      subtitle: (b.subtitle as string) || "",
      ctaText: (b.ctaText as string) || "Shop Now",
      ctaLink: (b.ctaLink as string) || "/",
      imageUrl: b.imageUrl as string,
      order: b.order as number,
      active: b.active as boolean,
    }));
  } catch {
    return [];
  }
}

export default async function HomePage({ searchParams }: HomeProps) {
  const { q } = await searchParams;
  const search = q?.trim() || "";

  let products: Awaited<ReturnType<typeof getProducts>>["products"] = [];
  let hasMore = false;
  let banners: BannerDTO[] = [];

  try {
    const [productData, bannerData] = await Promise.all([
      getProducts(1, 12, search || undefined),
      getBanners(),
    ]);
    products = productData.products;
    hasMore = productData.hasMore;
    banners = bannerData;
  } catch {
    // Build/startup without DB — render empty state
  }

  return (
    <>
      <HeroCarousel banners={banners.length ? banners : undefined} />
      <ProductGrid
        initialProducts={products}
        initialHasMore={hasMore}
        search={search}
      />
    </>
  );
}
