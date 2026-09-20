export type Category = "Men" | "Women" | "Kids" | "Infants";
export type Color = { name: string; hex: string };
export type Variant = { size: string; color: string; stock: number };
export type Product = {
  id: string; slug: string; name: string; category: Category;
  price: number; originalPrice: number; image: string; images: string[];
  colors: Color[]; sizes: string[]; variants: Variant[];
  badge?: string; description: string; fabric: string; care: string;
};
export type CartLine = { productId: string; size: string; color: string; quantity: number };
export type ShopState = { cart: CartLine[]; wishlist: string[]; products: Product[] };
export type Customer = { name: string; email: string; phone: string; address: string; city: string; pin: string; delivery: "delivery" | "pickup" };
export const lineKey = (item: CartLine) => `${item.productId}-${item.size}-${item.color}`;
export const money = (amount: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(amount);
