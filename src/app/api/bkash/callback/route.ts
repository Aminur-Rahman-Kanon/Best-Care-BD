import { NextRequest, NextResponse } from "next/server";
import { BkashConfig } from "@/types/bkash";
import { connectDB } from "@/lib/mongodb";
import { authHeaders } from '@/app/utilities/utilities';
import Order from "@/models/Order";

const bkashConfig = { 
    base_url: process.env.BKASH_BASE_URL,
    username: process.env.BKASH_USERNAME,
    password: process.env.BKASH_PASSWORD,
    app_key: process.env.BKASH_APP_KEY,
    app_secret: process.env.BKASH_APP_SECRET
}

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        
        const query = req.nextUrl.searchParams;
        const paymentId = query.get('paymentID');
        const myUrl = req.nextUrl.origin;

        if (!paymentId) {
            return NextResponse.redirect(`${myUrl}/payment/cancelled`, 303);
        }

        const order = await Order.findOne({ 'payment.paymentId': paymentId });

        if (!order) return NextResponse.redirect(`${myUrl}/payment/cancelled`, 303);
        const orderId = order.orderId

        const authHeader = await authHeaders(bkashConfig, orderId);

        const request = await fetch(`${bkashConfig.base_url}/tokenized/checkout/execute`, {
            method: 'POST',
            headers: {
                ...authHeader
            },
            body: JSON.stringify({ paymentID: paymentId })
        })

        const response = await request.json();

        if (response.statusCode === '0000'){
            await Order.updateOne(
                { orderId },
                {
                    $set: {
                        'payment.paymentStatus': 'success'
                    }
                }
            )
            return NextResponse.redirect(`${myUrl}/payment/success`, 303);
        }
        else {
            await Order.updateOne(
                { orderId },
                {
                    $set: {
                        'payment.paymentStatus': 'failed'
                    }
                }
            )
            return NextResponse.redirect(`${myUrl}/payment/failed`, 303);
        }
    } catch (error) {
        return NextResponse.json(
            { message: 'something went wrong' },
            { status: 500 }
        )        
    }
}