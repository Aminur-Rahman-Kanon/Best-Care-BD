import { notFound } from "next/navigation";
import { connectDB } from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import ProductForm from "@/components/admin/ProductForm";
import type { ProductDTO } from "@/types/server";

type Props = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  await connectDB();
  const doc = await Product.findById(id).lean();
  if (!doc) notFound();

  const product: ProductDTO = {
    _id: String(doc._id),
    title: doc.title as string,
    slug: doc.slug as string,
    details: (doc.details as string) || "",
    description: (doc.description as string) || "",
    price: doc.price as number,
    images: (doc.images as ProductDTO["images"]) || [],
    stock: doc.stock as number,
    seoTitle: (doc.seoTitle as string) || "",
    seoDescription: (doc.seoDescription as string) || "",
    createdAt: (doc.createdAt as Date).toISOString(),
  };

  return (
    <div>
      <h1 className="mb-6 text-2xl font-light uppercase tracking-wider">Edit Product</h1>
      <ProductForm product={product} />
    </div>
  );
}
