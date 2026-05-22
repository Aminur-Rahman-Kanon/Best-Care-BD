"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { useCallback, useState, useEffect } from "react";

export default function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") || "");

  useEffect(() => {
    setQuery(searchParams.get("q") || "");
  }, [searchParams]);

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();
      const params = new URLSearchParams();
      if (query.trim()) params.set("q", query.trim());
      router.push(`/${params.toString() ? `?${params}` : ""}`);
    },
    [query, router]
  );

  return (
    <section id="search" className="mx-auto w-full max-w-[600px] px-4 py-8">
      <form onSubmit={handleSubmit} className="relative" role="search">
        <label htmlFor="product-search" className="sr-only">
          Search products
        </label>
        <input
          id="product-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded border border-gray-300 py-3 pl-4 pr-12 text-sm outline-none transition-colors focus:border-accent focus:ring-1 focus:ring-accent"
        />
        <button
          type="submit"
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-brand-gray hover:text-accent transition-colors"
          aria-label="Search"
        >
          <Search className="h-5 w-5" />
        </button>
      </form>
    </section>
  );
}
