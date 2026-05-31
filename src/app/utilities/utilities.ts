import { BkashConfig } from "@/types/server/bkash";
import Order from "@/lib/db/models/Order";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/mongodb";

export const authHeaders = async (bkashConfig: BkashConfig, orderId: string, orderToken: string) => {
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: await grantToken(bkashConfig, orderId, orderToken),
        "x-app-key": bkashConfig.app_key ?? '',
    }
}

const grantToken = async (bkashConfig: BkashConfig, orderId: string, orderToken: string) => {
    try {
        const order = await Order.findOne({ orderId, orderToken });
        const findToken = order.payment.paymentToken;

        if (!findToken || findToken.updatedAt < new Date(Date.now() - 3600000)) { // 1 hour
            return await setToken(bkashConfig, orderId, orderToken);
        }

        return findToken;
    } catch (e) {
        console.log(e)
        return null
    }
}

const setToken = async (bkashConfig: BkashConfig, orderId: string, orderToken: string) => {
    try {
        const responses = await fetch(`${bkashConfig?.base_url}/tokenized/checkout/token/grant`, {
            method: 'POST',
            headers: {
                ...tokenHeaders(bkashConfig)
            },
            body: JSON.stringify(tokenParameters(bkashConfig))
        })
    
        const token = await responses.json();
    
        if (token?.id_token) {
            const findToken = await Order.findOne({ orderId, orderToken })
            findToken.payment.paymentToken = token?.id_token
            await findToken.save();
        }
        return token?.id_token;
    } catch (error) {
        throw new Error(error as string)
    }
}

const tokenParameters = (bkashConfig: BkashConfig) => {
    return {
        app_key: bkashConfig?.app_key,
        app_secret: bkashConfig?.app_secret,
    }
}

const tokenHeaders = (bkashConfig: BkashConfig) => {
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        username: bkashConfig.username ?? '',
        password: bkashConfig.password ?? '',
    }
}

export async function createMongooseSession() {
    try {
        await connectDB();

        const session = await mongoose.startSession();
        return session;
    } catch {
        // handle error here
        throw new Error('mongoose session creation failed.')
    }
}

export const bkashConfig = {
    base_url: process.env.BKASH_BASE_URL,
    username: process.env.BKASH_USERNAME,
    password: process.env.BKASH_PASSWORD,
    app_key: process.env.BKASH_APP_KEY,
    app_secret: process.env.BKASH_APP_SECRET
}
