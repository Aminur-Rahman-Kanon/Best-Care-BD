import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/auth";

export async function POST() {
  try {
    await clearAdminCookie();
    return NextResponse.json({ message: "Logged out" });
  } catch {
    return NextResponse.json({ error: "Logout failed" }, { status: 500 });
  }
}
