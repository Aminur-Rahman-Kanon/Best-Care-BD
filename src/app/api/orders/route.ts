import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import Order from "@/lib/db/models/Order";
import Product from "@/lib/db/models/Product";
import { getAdminFromCookie } from "@/lib/auth";
import { randomUUID, randomBytes } from 'crypto';
import { createMongooseSession } from '@/app/utilities/utilities';

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
  const session = await createMongooseSession();

  try {
    session.startTransaction();

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
      const product = await Product.findById(item.productId).lean().session(session);
      
      if (!product) {
        await session.abortTransaction();
        return NextResponse.json(
          { error: `Product not found: ${item.productId}` },
          { status: 400 }
        );
      }

      if (product.stock < item.quantity) {
        await session.abortTransaction();
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

      const orders = await Product.updateOne({
          _id: item.productId,
          stock: { $gte: item.quantity }
        },
        {
          $inc: { stock: -item.quantity },
        },
        {
          session
        });

      if (orders.modifiedCount !== 1) {
        await session.abortTransaction();

        return NextResponse.json(
          { message: 'Stock ran out during checkout!' },
          { status: 409 }
        )
      }
    }

    const orderId = randomUUID();
    const orderToken = randomBytes(32).toString('hex');

    const order = new Order({
      orderId,
      orderToken,
      customer: {
        fullName: customer.fullName,
        address: customer.address,
        phone: customer.phone,
        email: customer.email || '',
        paymentMethod: customer.paymentMethod || "Cash on Delivery",
      },
      items: orderItems,
      total,
      status: "pending",
      paymentStatus: 'pending'
    });

    await order.save({ session });
    await session.commitTransaction();
    
    return NextResponse.json({ orderId: order.orderId, orderToken: order.orderToken }, { status: 201 });
  } 
  catch (error) {
    await session.abortTransaction();
    const message = error instanceof Error ? error.message : "Checkout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
  finally {
    await session.endSession()
  }
}
