"use client";

import { useCartStore } from "@/store/cart";
import { useEffect, useState } from "react";

export default function CartBadge() {
  const count = useCartStore((s) => s.getItemCount());
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted || count === 0) return null;

  return (
    <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-white">
      {count > 99 ? "99+" : count}
    </span>
  );
}
