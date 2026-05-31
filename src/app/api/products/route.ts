import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Product from "@/lib/db/models/Product";
import { slugify, ensureUniqueSlug } from "@/lib/slug";
import { getAdminFromCookie } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const page = Math.max(1, Number(searchParams.get("page") || 1));
    const limit = Math.min(50, Number(searchParams.get("limit") || 12));
    const search = searchParams.get("search") || "";

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
    const [products, total] = await Promise.all([
      Product.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    return NextResponse.json({
      products,
      total,
      hasMore: skip + products.length < total,
      page,
    });
  } catch {
    return NextResponse.json({ error: "Failed to fetch products" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const body = await req.json();

    const stock = Number(body.stock);
    if (!Number.isFinite(stock) || stock < 1) {
      return NextResponse.json(
        { error: "Stock must be at least 1" },
        { status: 400 }
      );
    }

    const baseSlug = slugify(body.slug || body.title);

    const slug = await ensureUniqueSlug(
      baseSlug,
      async (s) => !!(await Product.findOne({ slug: s }).lean())
    );

    const product = await Product.create({
      title: body.title,
      slug,
      details: body.details || "",
      description: body.description || "",
      price: Number(body.price),
      images: body.images || [],
      stock,
      seoTitle: body.seoTitle || body.title,
      seoDescription: body.seoDescription || body.description || "",
    });

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create product";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
