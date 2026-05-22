import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import type { ProductDTO } from "@/types";

function toDTO(doc: Record<string, unknown>): ProductDTO {
  return {
    _id: String(doc._id),
    title: doc.title as string,
    slug: doc.slug as string,
    details: doc.details as string,
    description: doc.description as string,
    price: doc.price as number,
    images: (doc.images as ProductDTO["images"]) || [],
    stock: doc.stock as number,
    seoTitle: doc.seoTitle as string,
    seoDescription: doc.seoDescription as string,
    createdAt: (doc.createdAt as Date)?.toISOString?.() ?? String(doc.createdAt),
  };
}

export async function getProducts(
  page = 1,
  limit = 12,
  search?: string
): Promise<{ products: ProductDTO[]; total: number; hasMore: boolean }> {
  await connectDB();

  const filter = search
    ? {
        $or: [
          { title: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { details: { $regex: search, $options: "i" } },
        ],
      }
    : {};

  const skip = (page - 1) * limit;
  const [docs, total] = await Promise.all([
    Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(filter),
  ]);

  return {
    products: docs.map((d) => toDTO(d as Record<string, unknown>)),
    total,
    hasMore: skip + docs.length < total,
  };
}

export async function getProductBySlug(
  slug: string
): Promise<ProductDTO | null> {
  await connectDB();
  const doc = await Product.findOne({ slug }).lean();
  if (!doc) return null;
  return toDTO(doc as Record<string, unknown>);
}

export async function getRandomProducts(
  excludeId: string,
  limit = 4
): Promise<ProductDTO[]> {
  await connectDB();
  const mongoose = await import("mongoose");
  const excludeObjectId = new mongoose.Types.ObjectId(excludeId);
  const docs = await Product.aggregate([
    { $match: { _id: { $ne: excludeObjectId } } },
    { $sample: { size: limit } },
  ]);
  return docs.map((d) => toDTO(d as Record<string, unknown>));
}

export async function getAllProductSlugs(): Promise<{ slug: string }[]> {
  await connectDB();
  const docs = await Product.find({}, { slug: 1 }).lean();
  return docs.map((d) => ({ slug: d.slug as string }));
}
