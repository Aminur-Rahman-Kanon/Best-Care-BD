import type { Metadata } from "next";
import CartView from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description: "Review items in your Mela shopping cart.",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return <CartView />;
}
