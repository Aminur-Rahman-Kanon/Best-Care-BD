"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { X, Upload } from "lucide-react";
import type { ProductDTO, ProductImage } from "@/types/server";

interface ProductFormProps {
  product?: ProductDTO;
}

export default function ProductForm({ product }: ProductFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState<ProductImage[]>(product?.images || []);

  const [form, setForm] = useState({
    title: product?.title || "",
    slug: product?.slug || "",
    details: product?.details || "",
    description: product?.description || "",
    price: product?.price?.toString() || "",
    stock: product?.stock?.toString() || "1",
    seoTitle: product?.seoTitle || "",
    seoDescription: product?.seoDescription || "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("file", file);
        const res = await fetch("/api/upload", { method: "POST", body: fd });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error);
        setImages((prev) => [...prev, data]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const removeImage = (path: string) => {
    setImages((prev) => prev.filter((img) => img.path !== path));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!product && Number(form.stock) < 1) {
      setError("Stock must be at least 1 for new products.");
      setLoading(false);
      return;
    }

    const payload = {
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
      images,
    };

    try {
      const url = product
        ? `/api/products/${product._id}`
        : "/api/products";
      const res = await fetch(url, {
        method: product ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      router.push("/admin/products");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="grid gap-4 sm:grid-cols-2">
        {(
          [
            { name: "title", label: "Title" },
            { name: "slug", label: "Slug (optional)" },
            { name: "price", label: "Price", type: "number" },
            { name: "stock", label: "Stock", type: "number" },
            { name: "seoTitle", label: "SEO Title" },
          ] as const
        ).map((f) => (
          <div key={f.name} className={f.name === "seoTitle" ? "sm:col-span-2" : ""}>
            <label className="mb-1 block text-sm text-brand-gray">{f.label}</label>
            <input
              name={f.name}
              type={"type" in f ? f.type : "text"}
              value={form[f.name]}
              onChange={handleChange}
              required={
                f.name === "title" ||
                f.name === "price" ||
                (f.name === "stock" && !product)
              }
              min={f.name === "stock" && !product ? 1 : undefined}
              className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
            />
          </div>
        ))}
      </div>

      {(["details", "description", "seoDescription"] as const).map((name) => (
        <div key={name}>
          <label className="mb-1 block text-sm capitalize text-brand-gray">
            {name.replace(/([A-Z])/g, " $1")}
          </label>
          <textarea
            name={name}
            value={form[name]}
            onChange={handleChange}
            rows={name === "description" ? 5 : 3}
            className="w-full rounded border border-gray-300 px-3 py-2 text-sm"
          />
        </div>
      ))}

      <div>
        <label className="mb-2 block text-sm text-brand-gray">Images</label>
        <div className="flex flex-wrap gap-3">
          {images.map((img) => (
            <div key={img.path} className="relative h-20 w-20">
              <Image src={img.url} alt="" fill className="rounded object-cover" />
              <button
                type="button"
                onClick={() => removeImage(img.path)}
                className="absolute -right-2 -top-2 rounded-full bg-red-500 p-1 text-white"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
          <label className="flex h-20 w-20 cursor-pointer flex-col items-center justify-center rounded border border-dashed border-gray-400 hover:border-accent">
            <Upload className="h-5 w-5 text-brand-gray" />
            <span className="text-[10px] text-brand-gray">
              {uploading ? "..." : "Add"}
            </span>
            <input
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded bg-brand-dark px-6 py-2 text-sm text-white hover:bg-gray-800 disabled:opacity-50"
      >
        {loading ? "Saving..." : product ? "Update Product" : "Add Product"}
      </button>
    </form>
  );
}
