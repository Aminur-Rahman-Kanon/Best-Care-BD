"use client";

import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import type { ProductDTO } from "@/types/server";

export default function ProductTable({
  products: initial,
}: {
  products: ProductDTO[];
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initial);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this product and its images?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) {
      setProducts((prev) => prev.filter((p) => p._id !== id));
      router.refresh();
    }
  };

  if (!products.length) {
    return <p className="text-brand-gray">No products yet.</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-gray-200 text-brand-gray">
            <th className="p-3">Image</th>
            <th className="p-3">Title</th>
            <th className="p-3">Price</th>
            <th className="p-3">Stock</th>
            <th className="p-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} className="border-b border-gray-100">
              <td className="p-3">
                <div className="relative h-12 w-12">
                  <Image
                    src={p.images[0]?.url || "/images/icons/placeholder.svg"}
                    alt={p.title}
                    fill
                    className="rounded object-cover"
                  />
                </div>
              </td>
              <td className="p-3 font-medium">{p.title}</td>
              <td className="p-3">৳{p.price.toLocaleString()}</td>
              <td className="p-3">{p.stock}</td>
              <td className="p-3">
                <div className="flex gap-2">
                  <Link
                    href={`/admin/products/${p._id}/edit`}
                    className="text-brand-gray hover:text-accent"
                    aria-label={`Edit ${p.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => handleDelete(p._id)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Delete ${p.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
