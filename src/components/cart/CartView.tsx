"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore } from "@/store/cart";

export default function CartView() {
  const { items, updateQuantity, removeItem, getTotal } = useCartStore();

  if (!items.length) {
    return (
      <div className="flex flex-col items-center py-20">
        <p className="text-brand-gray">Your cart is empty.</p>
        <Link
          href="/"
          className="mt-6 flex h-10 w-[200px] items-center justify-center border border-brand-dark text-sm uppercase tracking-wide hover:bg-brand-dark hover:text-white transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[900px] px-4 py-10">
      <h1 className="mb-8 text-2xl font-light uppercase tracking-wider text-brand-dark">
        Shopping Cart
      </h1>

      <ul className="divide-y divide-gray-200">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-4 py-6">
            <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded border border-gray-200">
              <Image
                src={item.image}
                alt={item.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div>
                <Link
                  href={`/product/${item.slug}`}
                  className="text-sm font-medium uppercase text-brand-dark hover:text-accent"
                >
                  {item.title}
                </Link>
                <p className="mt-1 text-sm font-semibold">
                  ৳{item.price.toLocaleString()}
                </p>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="rounded border border-gray-300 p-1 hover:border-accent"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() =>
                      updateQuantity(
                        item.productId,
                        Math.min(item.quantity + 1, item.stock)
                      )
                    }
                    disabled={item.quantity >= item.stock}
                    className="rounded border border-gray-300 p-1 hover:border-accent disabled:opacity-50"
                    aria-label="Increase quantity"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  className="p-2 text-red-500 hover:text-red-700"
                  aria-label="Remove item"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            <p className="text-sm font-semibold">
              ৳{(item.price * item.quantity).toLocaleString()}
            </p>
          </li>
        ))}
      </ul>

      <div className="mt-8 border-t border-gray-200 pt-6">
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>৳{getTotal().toLocaleString()}</span>
        </div>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/checkout"
            className="w-full min-w-[200px] h-[40px] flex justify-center items-center bg-brand-dark text-sm font-semibold uppercase tracking-wide text-white hover:bg-gray-800 transition-colors"
          >
            Checkout
          </Link>
          <Link
            href="/"
            className="w-full min-w-[200px] h-[40px] flex justify-center items-center border border-brand-dark text-sm font-semibold uppercase tracking-wide hover:bg-brand-dark hover:text-white transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
