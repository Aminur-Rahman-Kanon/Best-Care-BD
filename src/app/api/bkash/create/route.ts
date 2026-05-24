import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongodb';
import Order from '@/models/Order';
import { authHeaders } from '@/app/utilities/utilities';

const bkashConfig = { 
    base_url: process.env.BKASH_BASE_URL,
    username: process.env.BKASH_USERNAME,
    password: process.env.BKASH_PASSWORD,
    app_key: process.env.BKASH_APP_KEY,
    app_secret: process.env.BKASH_APP_SECRET
}

export async function POST( req: NextRequest ) {
    try {
        const { orderId } = await req.json();
    
        if (!orderId) return NextResponse.json(
            { message: 'order id not found' },
            { status: 401 }
        )
    
        const orders = await Order.findOne({ orderId });
    
        if (!orders) return NextResponse.json(
            { message: 'item not found' },
            { status: 404 }
        )

    
        //figure out prices for the products
        let totalPrice = 0;
        for (const item of orders.items){
            totalPrice += (item.price * item.quantity);
        }

        const myURL = req.headers.get('origin');

        const authHeader = await authHeaders(bkashConfig, orderId);

        const bkashResponseBody = await fetch(`${bkashConfig.base_url}/tokenized/checkout/create`, {
            method: 'POST',
            headers: authHeader,
            body: JSON.stringify({
                mode: '0011',
                currency: 'BDT',
                intent: 'sale',
                amount: totalPrice,
                callbackURL: `${myURL}/api/bkash/callback`,
                payerReference: '1',
                merchantInvoiceNumber: orderId
            })
        })

        const bkashResponse = await bkashResponseBody.json();
        if (bkashResponse.statusCode !== '0000'){
            return NextResponse.json(
                { message: 'payment failed' },
                { status: 400 }
            )
        }

        await Order.updateOne(
            { orderId },
            {
                $set: {
                    'payment.paymentId': bkashResponse.paymentID
                }
            }
        )

        return NextResponse.json({ message: 'request successful', url: bkashResponse.bkashURL })
    } catch (error) {
        return NextResponse.json(
            {message: 'something went wrong' },
            { status: 500 }
        )
    }
}