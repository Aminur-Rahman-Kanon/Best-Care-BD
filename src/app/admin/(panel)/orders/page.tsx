import { connectDB } from "@/lib/db/mongodb";
import Order from "@/lib/db/models/Order";
import OrderTable from "@/components/admin/OrderTable";
import type { OrderDTO } from "@/types/server";

export default async function AdminOrdersPage() {
  await connectDB();
  const docs = await Order.find().sort({ createdAt: -1 }).lean();

  const orders: OrderDTO[] = docs.map((d) => ({
    _id: String(d._id),
    orderId: d.orderId as string,
    customer: d.customer as OrderDTO["customer"],
    items: d.items as OrderDTO["items"],
    total: d.total as number,
    status: d.status as OrderDTO["status"],
    createdAt: (d.createdAt as Date).toISOString(),
  }));

  return (
    <div>
      <h1 className="mb-6 text-2xl font-light uppercase tracking-wider">Orders</h1>
      <OrderTable initialOrders={orders} />
    </div>
  );
}
