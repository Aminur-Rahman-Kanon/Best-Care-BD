import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Payment Failed",
  description: "Your payment could not be completed.",
  robots: { index: false, follow: true },
};

export default function PaymentFailedPage() {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <h1 className="text-2xl font-light uppercase tracking-wider text-brand-dark">
        Payment failed
      </h1>
      <p className="mt-4 text-brand-gray">
        Your payment could not be completed. Your cart has been saved — you can
        try again.
      </p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
        <Link
          href="/checkout"
          className="bg-brand-dark px-6 py-3 text-sm uppercase tracking-wide text-white transition-colors hover:bg-gray-800"
        >
          Try again
        </Link>
        <Link
          href="/cart"
          className="border border-gray-300 px-6 py-3 text-sm uppercase tracking-wide text-brand-dark transition-colors hover:border-accent hover:text-accent"
        >
          View cart
        </Link>
        <Link
          href="/"
          className="text-sm uppercase tracking-wide text-brand-gray underline transition-colors hover:text-accent"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
