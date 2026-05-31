import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Banner from "@/lib/db/models/Banner";

export async function GET() {
  try {
    await connectDB();
    const banners = await Banner.find({ active: true })
      .sort({ order: 1 })
      .lean();
    return NextResponse.json(banners);
  } catch {
    return NextResponse.json([], { status: 200 });
  }
}
