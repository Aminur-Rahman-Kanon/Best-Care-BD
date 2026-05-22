import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import Order from "@/models/Order";
import { Package, ShoppingBag, DollarSign } from "lucide-react";

export default async function AdminDashboard() {
  await connectDB();
  const [productCount, orderCount, revenue] = await Promise.all([
    Product.countDocuments(),
    Order.countDocuments(),
    Order.aggregate([{ $group: { _id: null, total: { $sum: "$total" } } }]),
  ]);

  const totalRevenue = revenue[0]?.total || 0;

  const stats = [
    { label: "Products", value: productCount, icon: Package },
    { label: "Orders", value: orderCount, icon: ShoppingBag },
    { label: "Revenue", value: `৳${totalRevenue.toLocaleString()}`, icon: DollarSign },
  ];

  return (
    <div>
      <h1 className="mb-8 text-2xl font-light uppercase tracking-wider">Dashboard</h1>
      <div className="grid gap-6 sm:grid-cols-3">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-brand-gray">{label}</p>
                <p className="mt-2 text-2xl font-semibold">{value}</p>
              </div>
              <Icon className="h-8 w-8 text-accent opacity-60" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
