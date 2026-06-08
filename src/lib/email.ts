import nodemailer from "nodemailer";
import type { OrderItem } from "@/types/server";

interface OrderEmailData {
  orderId: string;
  fullName: string;
  address: string;
  phone: string;
  email: string;
  paymentMethod: string;
  items: OrderItem[];
  total: number;
}

function getTransporter() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

function buildItemsHtml(items: OrderItem[]): string {
  return items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px;border:1px solid #e5e7eb;">${item.title}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">${item.quantity}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">৳${item.price.toLocaleString()}</td>
          <td style="padding:8px;border:1px solid #e5e7eb;">৳${(item.price * item.quantity).toLocaleString()}</td>
        </tr>`
    )
    .join("");
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;
  const adminEmail = process.env.ADMIN_EMAIL;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto;">
      <h1 style="color:#374151;">Thank you for your order!</h1>
      <p>Hi <strong>${data.fullName}</strong>, we received your order.</p>
      <p><strong>Order ID:</strong> ${data.orderId}</p>
      <h2 style="color:#6b7280;font-size:16px;">Customer Details</h2>
      <ul>
        <li><strong>Name:</strong> ${data.fullName}</li>
        <li><strong>Address:</strong> ${data.address}</li>
        <li><strong>Phone:</strong> ${data.phone}</li>
        <li><strong>Email:</strong> ${data.email}</li>
        <li><strong>Payment:</strong> ${data.paymentMethod}</li>
      </ul>
      <h2 style="color:#6b7280;font-size:16px;">Ordered Products</h2>
      <table style="width:100%;border-collapse:collapse;">
        <thead>
          <tr style="background:#f3f4f6;">
            <th style="padding:8px;border:1px solid #e5e7eb;text-align:left;">Product</th>
            <th style="padding:8px;border:1px solid #e5e7eb;">Qty</th>
            <th style="padding:8px;border:1px solid #e5e7eb;">Price</th>
            <th style="padding:8px;border:1px solid #e5e7eb;">Subtotal</th>
          </tr>
        </thead>
        <tbody>${buildItemsHtml(data.items)}</tbody>
      </table>
      <p style="font-size:18px;margin-top:16px;"><strong>Total: ৳${data.total.toLocaleString()}</strong></p>
      <p style="color:#6b7280;font-size:14px;">— Best Care BD Shop</p>
    </div>
  `;

  await transporter.sendMail({
    from,
    to: data.email,
    subject: `Order Confirmation — ${data.orderId}`,
    html,
  });

  if (adminEmail) {
    await transporter.sendMail({
      from,
      to: adminEmail,
      subject: `New Order — ${data.orderId}`,
      html: `<p>New order from ${data.fullName} (${data.email}). Order ID: <strong>${data.orderId}</strong></p>${html}`,
    });
  }
}
