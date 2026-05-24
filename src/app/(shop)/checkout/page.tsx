import type { Metadata } from "next";
import CheckoutForm from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your order with Bkash or cash on delivery.",
  robots: { index: false, follow: true },
};

export default function CheckoutPage() {
  return <CheckoutForm />;
}
