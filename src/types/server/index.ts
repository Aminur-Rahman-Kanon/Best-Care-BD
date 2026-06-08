export interface ProductImage {
  url: string;
  path: string;
}

export interface ProductDTO {
  _id: string;
  title: string;
  slug: string;
  details: string;
  description: string;
  price: number;
  images: ProductImage[];
  stock: number;
  seoTitle: string;
  seoDescription: string;
  createdAt: string;
}

export interface CartItem {
  productId: string;
  slug: string;
  title: string;
  price: number;
  image: string;
  quantity: number;
  stock: number;
}

export interface OrderItem {
  productId: string;
  title: string;
  slug: string;
  price: number;
  quantity: number;
  image: string;
}

export interface OrderDTO {
  _id: string;
  orderId: string;
  orderToken: string,
  customer: {
    fullName: string;
    address: string;
    phone: string;
    email: string;
    paymentMethod: string;
  };
  items: OrderItem[];
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";
  createdAt: string;
}

export interface BannerDTO {
  _id: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaLink?: string;
  imageUrl: string;
  srcSetList: string
  order: number;
  active: boolean;
}
