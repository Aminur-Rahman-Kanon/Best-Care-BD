import mongoose from "mongoose";
import bcrypt from "bcrypt";

const AdminSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "admin" },
});

const Admin = mongoose.models.Admin || mongoose.model("Admin", AdminSchema);

async function seed() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("MONGODB_URI is required");
    process.exit(1);
  }

  await mongoose.connect(uri);

  const email = process.env.ADMIN_EMAIL || "admin@mela.com";
  const password = process.env.ADMIN_PASSWORD || "change-me-secure-password";
  const name = process.env.ADMIN_NAME || "Admin";

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`Admin already exists: ${email}`);
    process.exit(0);
  }

  const hashed = await bcrypt.hash(password, 12);
  await Admin.create({ name, email, password: hashed, role: "admin" });
  console.log(`Admin created: ${email}`);
  process.exit(0);
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
