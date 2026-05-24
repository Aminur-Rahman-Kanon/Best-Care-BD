import type { Metadata } from "next";
import Link from "next/link";
import ClearCartOnMount from "@/components/payment/ClearCartOnMount";
import RelatedProducts from "@/components/product/RelatedProducts";
import { getProducts } from "@/lib/products";

export const metadata: Metadata = {
  title: "Payment Successful",
  description: "Your payment was completed successfully.",
  robots: { index: false, follow: true },
};

export default async function PaymentSuccessPage() {
  let products: Awaited<ReturnType<typeof getProducts>>["products"] = [];

  try {
    const data = await getProducts(1, 4);
    products = data.products;
  } catch {
    // DB unavailable — still show success UI
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-16">
      <ClearCartOnMount />
      <div className="mx-auto max-w-lg text-center">
        <h1 className="text-2xl font-light uppercase tracking-wider text-brand-dark">
          Payment successful
        </h1>
        <p className="mt-4 text-brand-gray">
          Thank you for your order. We&apos;ll process it shortly.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block bg-brand-dark px-6 py-3 text-sm uppercase tracking-wide text-white transition-colors hover:bg-gray-800"
        >
          Continue shopping
        </Link>
      </div>
      <RelatedProducts products={products} />
    </div>
  );
}
