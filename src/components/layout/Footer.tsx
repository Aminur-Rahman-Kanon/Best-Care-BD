import Link from "next/link";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-gray-200 bg-gray-50">
      <div className="mx-auto max-w-[1400px] px-4 py-10">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="text-center md:text-left">
            <p className="text-xl font-light uppercase tracking-[0.2em] text-brand-dark">Mela</p>
            <p className="mt-2 text-sm text-brand-gray">
              Quality products delivered to your doorstep.
            </p>
          </div>
          <nav className="flex gap-6 text-sm text-brand-gray">
            <Link href="/" className="hover:text-accent transition-colors">Home</Link>
            <Link href="/cart" className="hover:text-accent transition-colors">Cart</Link>
            <Link href="/checkout" className="hover:text-accent transition-colors">Checkout</Link>
          </nav>
        </div>
        <p className="mt-8 text-center text-xs text-brand-gray">
          © {year} Mela. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
