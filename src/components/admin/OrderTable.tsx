"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";
import type { OrderDTO } from "@/types";

export default function OrderTable({ initialOrders }: { initialOrders: OrderDTO[] }) {
  const [orders, setOrders] = useState(initialOrders);

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setOrders((prev) =>
        prev.map((o) => (o._id === id ? { ...o, status: updated.status } : o))
      );
    }
  };

  const deleteOrder = async (id: string) => {
    if (!confirm("Delete this order?")) return;
    const res = await fetch(`/api/orders/${id}`, { method: "DELETE" });
    if (res.ok) setOrders((prev) => prev.filter((o) => o._id !== id));
  };

  if (!orders.length) {
    return <p className="text-brand-gray">No orders yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-brand-gray">
            <th className="p-3">Order ID</th>
            <th className="p-3">Customer</th>
            <th className="p-3">Total</th>
            <th className="p-3">Status</th>
            <th className="p-3">Date</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b border-gray-100">
              <td className="p-3 font-mono text-xs">{order.orderId.slice(0, 8)}...</td>
              <td className="p-3">
                <p className="font-medium">{order.customer.fullName}</p>
                <p className="text-xs text-brand-gray">{order.customer.email}</p>
              </td>
              <td className="p-3">৳{order.total.toLocaleString()}</td>
              <td className="p-3">
                <select
                  value={order.status}
                  onChange={(e) => updateStatus(order._id, e.target.value)}
                  className="rounded border border-gray-300 px-2 py-1 text-xs"
                >
                  {["pending", "confirmed", "shipped", "delivered", "cancelled"].map(
                    (s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    )
                  )}
                </select>
              </td>
              <td className="p-3 text-xs text-brand-gray">
                {new Date(order.createdAt).toLocaleDateString()}
              </td>
              <td className="p-3">
                <button
                  type="button"
                  onClick={() => deleteOrder(order._id)}
                  className="text-red-500 hover:text-red-700"
                  aria-label="Delete order"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
