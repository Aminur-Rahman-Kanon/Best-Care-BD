import { BkashConfig } from "@/types/bkash";
import Order from "@/models/Order";

export const authHeaders = async (bkashConfig: BkashConfig, orderId: string) => {
    return {
        "Content-Type": "application/json",
        Accept: "application/json",
        authorization: await grantToken(bkashConfig, orderId),
        "x-app-key": bkashConfig.app_key ?? '',
    }
}

const grantToken = async (bkashConfig: BkashConfig, orderId: string) => {
    try {
        const order = await Order.findOne({ orderId });
        const findToken = order.payment.paymentToken;

        if (!findToken || findToken.updatedAt < new Date(Date.now() - 3600000)) { // 1 hour
            return await setToken(bkashConfig, orderId);
        }

        return findToken;
    } catch (e) {
        console.log(e)
        return null
    }
}

const setToken = async (bkashConfig: BkashConfig, orderId: string) => {
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
            const findToken = await Order.findOne({ orderId })
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