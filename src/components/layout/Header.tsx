"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ShoppingCart, Search, Menu, X } from "lucide-react";
import { useCallback, useEffect, useState, Suspense } from "react";
import CartBadge from "./CartBadge";
import MobileMenu from "./MobileMenu";

function SearchPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      router.push(`/${params.toString() ? `?${params}` : ""}`);
      onClose();
    },
    [query, router, onClose]
  );

  return (
    <div
      className={`overflow-hidden border-b border-gray-200 bg-white transition-all duration-300 ease-in-out ${
        open ? "max-h-24 opacity-100" : "max-h-0 opacity-0"
      }`}
    >
      <form
        onSubmit={handleSubmit}
        className="mx-auto flex max-w-[1400px] items-center gap-2 px-4 py-3"
        role="search"
      >
        <label htmlFor="header-search" className="sr-only">
          Search products
        </label>
        <input
          id="header-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          autoFocus={open}
          className="flex-1 rounded border border-gray-300 py-2.5 pl-4 pr-4 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          className="rounded bg-brand-dark px-4 py-2.5 text-xs uppercase tracking-wider text-white transition-colors hover:bg-accent"
        >
          Search
        </button>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-brand-gray transition-colors hover:text-accent"
          aria-label="Close search"
        >
          <X className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
}

function HeaderInner() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm">
        <div className="mx-auto grid max-w-[1400px] grid-cols-3 items-center gap-2 p-3 md:grid-cols-[1fr_auto_1fr] md:p-4">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="p-2 text-brand-gray transition-colors hover:text-accent md:hidden"
              aria-label="Open menu"
            >
              <Menu className="h-5 w-5" />
            </button>
            <nav className="hidden items-center gap-6 md:flex">
              <Link
                href="/"
                className="text-sm uppercase tracking-wider text-brand-gray transition-colors hover:text-accent"
              >
                Home
              </Link>
              <Link
                href="/cart"
                className="text-sm uppercase tracking-wider text-brand-gray transition-colors hover:text-accent"
              >
                Cart
              </Link>
            </nav>
          </div>

          <Link href="/" className="flex justify-center" aria-label="Mela Home">
            <span className="text-2xl font-light uppercase tracking-[0.3em] text-brand-dark md:text-3xl">
              Mela
            </span>
          </Link>

          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen((v) => !v)}
              className={`p-2 transition-colors ${
                searchOpen ? "text-accent" : "text-brand-gray hover:text-accent"
              }`}
              aria-label="Search products"
              aria-expanded={searchOpen}
            >
              <Search className="h-5 w-5" />
            </button>
            <Link
              href="/cart"
              className="relative p-2 text-brand-gray transition-colors hover:text-accent"
              aria-label="Shopping cart"
            >
              <ShoppingCart className="h-5 w-5" />
              <CartBadge />
            </Link>
          </div>
        </div>
        <Suspense fallback={null}>
          <SearchPanel open={searchOpen} onClose={() => setSearchOpen(false)} />
        </Suspense>
      </header>
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}

export default function Header() {
  return <HeaderInner />;
}
