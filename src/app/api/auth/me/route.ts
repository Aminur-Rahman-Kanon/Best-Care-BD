import { NextResponse } from "next/server";
import { getAdminFromCookie } from "@/lib/auth";

export async function GET() {
  const admin = await getAdminFromCookie();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ name: admin.name, email: admin.email, role: admin.role });
}
