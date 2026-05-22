import type { MetadataRoute } from "next";
import { getAllProductSlugs } from "@/lib/products";
import { getSiteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = getSiteUrl();
  const staticPages: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: getSiteUrl("/cart"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: getSiteUrl("/checkout"), lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  try {
    const slugs = await getAllProductSlugs();
    const productPages: MetadataRoute.Sitemap = slugs.map(({ slug }) => ({
      url: getSiteUrl(`/product/${slug}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticPages, ...productPages];
  } catch {
    return staticPages;
  }
}
