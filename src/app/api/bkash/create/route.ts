import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db/mongodb';
import Order from '@/lib/db/models/Order';
import { authHeaders, bkashConfig } from '@/app/utilities/utilities';

export async function POST( req: NextRequest ) {
    try {
        await connectDB();

        const { orderId, orderToken } = await req.json();
    
        if (!orderId || !orderToken) return NextResponse.json(
            { message: 'order id/token not found' },
            { status: 401 }
        )
    
        const orders = await Order.findOne({
            orderId,
            orderToken
        }).lean();
    
        if (!orders) return NextResponse.json(
            { message: 'Order not found' },
            { status: 404 }
        )

        if (orders.payment.paymentStatus === 'initiated') return NextResponse.json(
            { message: 'Payment already initiated!' },
            { status: 403 }
        )

        if (orders.payment.paymentStatus === 'paid') return NextResponse.json(
            { message: 'Its already paid.' },
            { status: 202 }
        )

        const verifiedOrderId = orders.orderId;
        const verifiedOrderToken = orders.orderToken;
    
        //figure out prices for the products
        let totalPrice = 0;
        for (const item of orders.items){
            totalPrice += (item.price * item.quantity);
        }

        const myURL = process.env.APP_URL ?? (
            process.env.NODE_ENV === 'development' ?
            'http://localhost:3000'
            :
            undefined
        )

        if (!myURL) throw new Error('APP_URL is not required.')

        const authHeader = await authHeaders(bkashConfig, verifiedOrderId, verifiedOrderToken);

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
                merchantInvoiceNumber: verifiedOrderId
            })
        })

        if (!bkashResponseBody.ok) return NextResponse.json(
            { message: 'Bkash token creation failed.' },
            { status: 401 }
        )

        const bkashResponse = await bkashResponseBody.json();
        console.log(bkashResponse);

        if (
            bkashResponse.statusCode !== '0000' ||
            !bkashResponse.bkashURL ||
            !bkashResponse.paymentID
        )
        {
            return NextResponse.json(
                { message: 'payment failed' },
                { status: 400 }
            )
        }

        const order = await Order.findOneAndUpdate(
            {
                orderId: verifiedOrderId,
                orderToken: verifiedOrderToken,
                'payment.paymentStatus': 'pending'
            },
            {
                $set: {
                    'payment.paymentId': bkashResponse.paymentID,
                    'payment.paymentStatus': 'initiated'
                }
            },
            { new: true }
        )

        if (!order) return NextResponse.json(
            { message: 'Payment already initiated or invalid state' },
            { status: 409 }
        )

        return NextResponse.json({ message: 'request successful', url: bkashResponse.bkashURL })
    } catch (error) {
        console.log(error);
        if (error instanceof TypeError){
            return NextResponse.json(
                { message: 'Network error' },
                { status: 500 }
            )
        }

        return NextResponse.json(
            { message: 'Unknown error occured.' },
            { status: 500 }
        )
    }
}
