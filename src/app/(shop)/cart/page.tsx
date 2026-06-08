import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review items in your Best Care BD shopping cart.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartView />;
}
