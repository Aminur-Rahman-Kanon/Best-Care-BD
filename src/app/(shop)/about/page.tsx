import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about Best Care BD — quality products delivered to your doorstep.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="mb-8 text-2xl font-light uppercase tracking-wider text-brand-dark">
        About Us
      </h1>
      <div className="space-y-6 text-brand-gray leading-relaxed">
        <p>
          Welcome to Best Care BD — your destination for quality products delivered
          straight to your doorstep. We believe shopping should be simple,
          trustworthy, and enjoyable.
        </p>
        <p>
          Our team carefully selects every item in our catalogue so you can shop
          with confidence. From browsing to checkout, we focus on a smooth
          experience and reliable delivery across Bangladesh.
        </p>
        <p>
          Whether you&apos;re treating yourself or sending a gift, Best Care BD is here
          to help you find what you need. Thank you for choosing us.
        </p>
      </div>
    </div>
  );
}
