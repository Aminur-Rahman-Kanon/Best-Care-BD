import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { connectDB } from "@/lib/mongodb";
import Order from "@/models/Order";
import Product from "@/models/Product";
import { sendOrderConfirmationEmail } from "@/lib/email";
import { getAdminFromCookie } from "@/lib/auth";

export async function GET() {
  try {
    const admin = await getAdminFromCookie();
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 }).lean();
    return NextResponse.json(orders);
  } catch {
    return NextResponse.json({ error: "Failed to fetch orders" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();
    const { customer, items } = body;

    if (!customer?.fullName || !customer?.address || !customer?.phone || !customer?.email) {
      return NextResponse.json({ error: "Missing customer fields" }, { status: 400 });
    }

    if (!items?.length) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    const orderItems = [];
    let total = 0;

    for (const item of items) {
      const product = await Product.findById(item.productId).lean();
      if (!product) {
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Insufficient stock for ${product.title}` },
          { status: 400 }
        );
      }

      const subtotal = product.price * item.quantity;
      total += subtotal;
      orderItems.push({
        productId: String(product._id),
        title: product.title,
        slug: product.slug,
        price: product.price,
        quantity: item.quantity,
        image: product.images?.[0]?.url || "",
      });

      await Product.findByIdAndUpdate(product._id, {
        $inc: { stock: -item.quantity },
      });
    }

    const orderId = uuidv4();
    const order = await Order.create({
      orderId,
      customer: {
        fullName: customer.fullName,
        address: customer.address,
        phone: customer.phone,
        email: customer.email,
        paymentMethod: customer.paymentMethod || "Cash on Delivery",
      },
      items: orderItems,
      total,
      status: "pending",
      paymentStatus: 'pending'
    });

    // try {
    //   await sendOrderConfirmationEmail({
    //     orderId,
    //     fullName: customer.fullName,
    //     address: customer.address,
    //     phone: customer.phone,
    //     email: customer.email,
    //     paymentMethod: customer.paymentMethod || "Cash on Delivery",
    //     items: orderItems,
    //     total,
    //   });
    // } catch (emailError) {
    //   console.error("Email send failed:", emailError);
    // }

    return NextResponse.json({ orderId: order.orderId, _id: order._id }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
