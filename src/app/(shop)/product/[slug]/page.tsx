import { notFound } from "next/navigation";
import type { Metadata } from "next";
import {
  getProductBySlug,
  getRandomProducts,
} from "@/lib/products";
import {
  buildProductMetadata,
  productJsonLd,
  breadcrumbJsonLd,
  getSiteUrl,
} from "@/lib/seo";
import JsonLd from "@/components/seo/JsonLd";
import Breadcrumbs from "@/components/seo/Breadcrumbs";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductActions from "@/components/product/ProductActions";
import RelatedProducts from "@/components/product/RelatedProducts";

export const revalidate = 3600;

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Product Not Found" };
  return buildProductMetadata(product);
}

export async function generateStaticParams() {
  try {
    const { getAllProductSlugs } = await import("@/lib/products");
    return await getAllProductSlugs();
  } catch {
    return [];
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) notFound();

  const related = await getRandomProducts(product._id, 4);
  const productUrl = getSiteUrl(`/product/${product.slug}`);

  return (
    <>
      <JsonLd
        data={[
          productJsonLd(product),
          breadcrumbJsonLd([
            { name: "Home", url: getSiteUrl() },
            { name: product.title, url: productUrl },
          ]),
        ]}
      />

      <article className="mx-auto max-w-[1200px] px-4 py-8 lg:py-16">
        <Breadcrumbs
          items={[
            { label: "Home", href: "/" },
            { label: product.title },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-2">
          <ProductImageGallery images={product.images} title={product.title} />

          <div>
            <h1 className="text-2xl font-normal uppercase tracking-wide text-brand-dark md:text-3xl">
              {product.title}
            </h1>
            <p className="mt-4 text-2xl font-semibold text-brand-dark">
              ৳{product.price.toLocaleString()}
            </p>
            {product.stock > 0 ? (
              <p className="mt-2 text-sm text-accent">In stock ({product.stock})</p>
            ) : (
              <p className="mt-2 text-sm text-red-500">Out of stock</p>
            )}

            {product.details && (
              <p className="mt-4 text-sm text-brand-gray">{product.details}</p>
            )}

            <ProductActions product={product} />

            {product.description && (
              <section className="mt-10 border-t border-gray-200 pt-8">
                <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-brand-gray">
                  Description
                </h2>
                <div
                  className="prose prose-sm max-w-none text-brand-gray"
                  dangerouslySetInnerHTML={{
                    __html: product.description.replace(/\n/g, "<br />"),
                  }}
                />
              </section>
            )}

          </div>
        </div>

        <RelatedProducts products={related} />
      </article>
    </>
  );
}
