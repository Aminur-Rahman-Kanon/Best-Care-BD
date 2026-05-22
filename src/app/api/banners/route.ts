import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Banner from "@/models/Banner";

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
