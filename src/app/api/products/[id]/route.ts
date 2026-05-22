import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import { slugify, ensureUniqueSlug } from "@/lib/slug";
import { getAdminFromCookie } from "@/lib/auth";
import { deleteSupabaseFiles } from "@/lib/supabase";

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id).lean();
    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(product);
  } catch {
    return NextResponse.json({ error: "Failed to fetch product" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const body = await req.json();

    let slug = body.slug ? slugify(body.slug) : undefined;
    if (slug) {
      slug = await ensureUniqueSlug(
        slug,
        async (s, excludeId) => {
          const found = await Product.findOne({ slug: s }).lean();
          return !!found && String(found._id) !== (excludeId || id);
        },
        id
      );
    }

    const update: Record<string, unknown> = {
      title: body.title,
      details: body.details,
      description: body.description,
      price: Number(body.price),
      images: body.images,
      stock: Number(body.stock),
      seoTitle: body.seoTitle,
      seoDescription: body.seoDescription,
    };
    if (slug) update.slug = slug;

    const product = await Product.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    }).lean();

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(product);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const { id } = await params;
    const product = await Product.findById(id).lean();

    if (!product) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const paths = (product.images || []).map(
      (img: { path: string }) => img.path
    );
    await deleteSupabaseFiles(paths);
    await Product.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted" });
  } catch {
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
