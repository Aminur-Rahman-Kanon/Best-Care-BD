import { FormType, CreateInitialOrderResponse } from "@/types/client/checkout";
import { OrderItem } from '@/types/server';

type InitialOrderType = {
  orderId: string,
  orderToken: string
}

export const createInitialOrder = async (form: FormType, items: OrderItem[]): Promise<InitialOrderType> => {
    try {
        const response = await fetch("/api/orders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              customer: form,
              items: items.map((i) => ({
                productId: i.productId,
                quantity: i.quantity,
              })),
            }),
        });

        if (!response.ok) {
          throw new Error('Server endpoint error.')
        }

        const data = await response.json();
        if (!data.orderId || !data.orderToken){
          throw new Error('no order id or token provided');
        }

        return { orderId: data.orderId, orderToken: data.orderToken };
    } catch (error) {
      if (error instanceof TypeError) {
        throw new Error("Network error. Please check your internet connection.")
      }
      throw new Error(error instanceof Error ? error.message : 'Unknown error occured');
    }
}

export async function createBkashPaymentRequest( orderId: string, orderToken: string ): Promise<string> {
  if (!orderId || !orderToken) {
    throw new Error('Order "id/token" not provided');
  }

  try {
    const createPaymentRequest = await fetch('/api/bkash/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ orderId, orderToken })
    });

    if (!createPaymentRequest.ok) {
      throw new Error('Server endpoint error.');
    }
  
    const response = await createPaymentRequest.json();

    if (!response.url){
      throw new Error('Obtaining payment gateway redirect url failed.');
    }
  
    return response.url;
  } catch (error) {
    if (error instanceof TypeError) {
      throw new Error("Network error. Please check your internet connection.")
    }
    throw new Error(error instanceof Error ? error.message : 'Unknown error occured.');
  }
}
