export interface FormType {
    fullName: string,
    address: string,
    email: string,
    phone: string,
    paymentMethod: 'Cash on delivery' | 'Bkash'
}

type CreateOrderResponse = {
    orderId: string
}

type ApiError = {
    error: Error
}

export type CreateInitialOrderResponse = Promise<CreateOrderResponse | ApiError>;
