"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore } from "@/store/cart";
import { createInitialOrder, createBkashPaymentRequest } from '@/lib/client/createPayment';
import { FormType } from "@/types/client/checkout";

export default function CheckoutForm() {
  const router = useRouter();
  const { items, getTotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState<FormType>({
    fullName: "",
    address: "",
    phone: "",
    email: "",
    paymentMethod: "Cash on delivery",
  });

  const isValid = useMemo(
    () =>
      form.fullName.trim() &&
      form.address.trim() &&
      form.phone.trim() &&
      form.email.trim() &&
      form.paymentMethod,
    [form]
  );

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isValid || !items.length) return;

    setLoading(true);
    setError("");

    try {
      const { orderId, orderToken } = await createInitialOrder(form, items);

      if (form.paymentMethod === 'Bkash'){
        const redirectUrl = await createBkashPaymentRequest(orderId, orderToken);
  
        return window.location.href = redirectUrl;
      }
      else {
        clearCart();
        setSuccess(orderId);
        return setTimeout(() => router.push("/"), 5000);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Checkout failed");
    } finally {
      setLoading(false);
    }
  };

  if (!items.length && !success) {
    return (
      <div className="py-20 text-center">
        <p className="text-brand-gray">Your cart is empty.</p>
        <Link href="/" className="mt-4 inline-block text-accent underline">
          Continue shopping
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="mx-auto max-w-lg py-20 text-center">
        <h1 className="text-2xl font-semibold text-brand-dark">Order Placed!</h1>
        <p className="mt-4 text-brand-gray">
          Your order ID: <strong>{success}</strong>
        </p>
        <p className="mt-2 text-sm text-brand-gray">
          A confirmation email has been sent. Redirecting to home...
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg px-4 py-10">
      <h1 className="mb-8 text-2xl font-light uppercase tracking-wider">Checkout</h1>

      {error && (
        <p className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="space-y-4">
        {(
          [
            { name: "fullName", label: "Full Name", type: "text" },
            { name: "address", label: "Address", type: "text", multiline: true },
            { name: "phone", label: "Phone Number", type: "tel" },
            { name: "email", label: "Email Address", type: "email" },
          ] as const
        ).map((field) => (
          <div key={field.name}>
            <label htmlFor={field.name} className="mb-1 block text-sm text-brand-gray">
              {field.label} *
            </label>
            {"multiline" in field && field.multiline ? (
              <textarea
                id={field.name}
                name={field.name}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required
                rows={3}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={form[field.name as keyof typeof form]}
                onChange={handleChange}
                required
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent"
              />
            )}
          </div>
        ))}

        <div>
          <label htmlFor="paymentMethod" className="mb-1 block text-sm text-brand-gray">
            Payment Method *
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={form.paymentMethod}
            onChange={handleChange}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm outline-none focus:border-accent"
          >
            <option value="Cash on Delivery">Cash on Delivery</option>
            <option value="Bkash">Bkash</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex justify-between border-t border-gray-200 pt-4 font-semibold">
        <span>Order Total</span>
        <span>৳{getTotal().toLocaleString()}</span>
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="mt-6 h-12 w-full bg-brand-dark text-sm font-semibold uppercase tracking-wide text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
      >
        {loading ? "Processing..." : "Place Order"}
      </button>
    </form>
  );
}
