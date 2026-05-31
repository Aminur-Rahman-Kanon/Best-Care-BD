import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { connectDB } from "@/lib/db/mongodb";
import Admin from "@/lib/db/models/Admin";
import { signAdminToken, setAdminCookie } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    await connectDB();
    const user = await Admin.findOne({ email }).lean();

    if (!user) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid || user.role !== "admin") {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    const token = signAdminToken({
      name: user.name,
      email: user.email,
      role: user.role,
    });

    await setAdminCookie(token);

    return NextResponse.json({ message: "Login successful", name: user.name });
  } catch {
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}

