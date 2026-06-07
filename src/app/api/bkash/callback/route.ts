import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db/mongodb";
import { authHeaders, bkashConfig } from '@/app/utilities/utilities';
import Order from "@/lib/db/models/Order";

export async function GET(req: NextRequest) {
    try {
        await connectDB();
        
        const query = req.nextUrl.searchParams;
        const paymentId = query.get('paymentID');
        
        const myUrl = process.env.APP_URL ?? (
            process.env.NODE_ENV === 'development' ?
            'http://localhost:3000'
            :
            undefined
        )

        if (!paymentId) {
            return NextResponse.redirect(`${myUrl}/payment/cancelled`, 303);
        }

        const order = await Order.findOne({ 'payment.paymentId': paymentId });

        if (!order) return NextResponse.redirect(`${myUrl}/payment/cancelled`, 303);
        
        const orderId = order.orderId;
        const orderToken = order.orderToken;

        const authHeader = await authHeaders(bkashConfig, orderId, orderToken);

        const request = await fetch(`${bkashConfig.base_url}/tokenized/checkout/execute`, {
            method: 'POST',
            headers: {
                ...authHeader
            },
            body: JSON.stringify({ paymentID: paymentId })
        })

        if (!request.ok) return NextResponse.json(
            { message: 'Payment execution failed' },
            { status: 502 }
        )

        const response = await request.json();

        if (
            response.statusCode === '0000'
            && response.transactionStatus === 'Completed'
            && response.amount 
            && response.paymentID 
            && response.trxID 
            && response.merchantInvoiceNumber
        )
        {
            await Order.updateOne(
                {
                    orderId,
                    orderToken
                },
                {
                    $set: {
                        'payment.paymentStatus': 'paid'
                    }
                }
            )
            return NextResponse.redirect(`${myUrl}/payment/success`, 303);
        }
        else {
            await Order.updateOne(
                {
                    orderId,
                    orderToken
                },
                {
                    $set: {
                        'payment.paymentStatus': 'failed'
                    }
                }
            )
            return NextResponse.redirect(`${myUrl}/payment/failed`, 303);
        }
    } catch (error) {
        if (error instanceof TypeError) {
            return NextResponse.json(
                { message: 'Network error!' },
                { status: 500 }
            )
        }
        return NextResponse.json(
            { message: 'Unknown error occured!' },
            { status: 502 }
        )        
    }
}
