import type { Metadata } from "next";
import type { ProductDTO } from "@/types/server";

const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Best Care BD";
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function getSiteUrl(path = ""): string {
  const base = siteUrl.replace(/\/$/, "");
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p === "/" ? "" : p}`;
}

export function buildProductMetadata(product: ProductDTO): Metadata {
  const title = product.seoTitle || product.title;
  const description =
    product.seoDescription || product.description || product.details;
  const url = getSiteUrl(`/product/${product.slug}`);
  const image = product.images[0]?.url;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "website",
      url,
      title,
      description,
      siteName,
      images: image
        ? [{ url: image, width: 1200, height: 630, alt: product.title }]
        : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : [],
    },
    robots: { index: true, follow: true },
  };
}

export function buildDefaultMetadata(): Metadata {
  return {
    title: {
      default: `${siteName} — Online Shop`,
      template: `%s | ${siteName}`,
    },
    description:
      "Shop quality products at Best Care BD. Browse our collection and order with cash on delivery.",
    metadataBase: new URL(siteUrl),
    alternates: { canonical: siteUrl },
    openGraph: {
      type: "website",
      url: siteUrl,
      siteName,
      title: `${siteName} — Online Shop`,
      description: "Shop quality products at Best Care BD.",
    },
    twitter: {
      card: "summary_large_image",
      title: `${siteName} — Online Shop`,
      description: "Shop quality products at Best Care BD.",
    },
    robots: { index: true, follow: true },
  };
}

export function productJsonLd(product: ProductDTO) {
  const url = getSiteUrl(`/product/${product.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description || product.details,
    image: product.images.map((img) => img.url),
    sku: product._id,
    url,
    offers: {
      "@type": "Offer",
      priceCurrency: "BDT",
      price: product.price,
      availability:
        product.stock > 0
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      url,
    },
  };
}

export function breadcrumbJsonLd(
  items: { name: string; url: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}
