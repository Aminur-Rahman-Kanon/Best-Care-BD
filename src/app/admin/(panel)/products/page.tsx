import Link from "next/link";
import { connectDB } from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import ProductTable from "@/components/admin/ProductTable";
import type { ProductDTO } from "@/types/server";
import { Plus } from "lucide-react";

export default async function AdminProductsPage() {
  await connectDB();
  const docs = await Product.find().sort({ createdAt: -1 }).lean();

  const products: ProductDTO[] = docs.map((d) => ({
    _id: String(d._id),
    title: d.title as string,
    slug: d.slug as string,
    details: (d.details as string) || "",
    description: (d.description as string) || "",
    price: d.price as number,
    images: (d.images as ProductDTO["images"]) || [],
    stock: d.stock as number,
    seoTitle: (d.seoTitle as string) || "",
    seoDescription: (d.seoDescription as string) || "",
    createdAt: (d.createdAt as Date).toISOString(),
  }));

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-light uppercase tracking-wider">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded bg-brand-dark px-4 py-2 text-sm text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4" />
          Add Product
        </Link>
      </div>
      <ProductTable products={products} />
    </div>
  );
}
