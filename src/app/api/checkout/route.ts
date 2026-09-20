import { db } from "@/db";
import { orders, products, shoppingSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { errorResponse, getSessionId } from "@/lib/server-store";
import type { Customer } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customer = body.customer as Customer;
    if (!customer || typeof customer.name !== "string" || customer.name.trim().length < 2 || customer.name.length > 100) throw new Error("Please enter your full name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer.email) || customer.email.length > 180) throw new Error("Please enter a valid email address.");
    if (!/^[6-9]\d{9}$/.test(customer.phone)) throw new Error("Please enter a valid 10-digit Indian mobile number.");
    if (customer.delivery !== "pickup" && customer.delivery !== "delivery") throw new Error("Choose delivery or store pickup.");
    if (customer.delivery === "delivery" && (!customer.address || customer.address.trim().length < 8 || customer.address.length > 400 || !customer.city?.trim() || !/^[1-8]\d{5}$/.test(customer.pin))) throw new Error("Please check your delivery address and six-digit PIN code.");
    if (!["upi","card","netbanking"].includes(body.paymentMethod)) throw new Error("Choose a prototype payment method.");
    const sessionId = await getSessionId();
    const result = await db.transaction(async tx => {
      const [session] = await tx.select().from(shoppingSessions).where(eq(shoppingSessions.id, sessionId)).for("update");
      if (!session.cart.length) throw new Error("Your bag is empty. Add a little style before checking out.");
      const rows = await tx.select().from(products).orderBy(products.id).for("update");
      const catalogue = new Map(rows.map(row => [row.id, structuredClone(row.data)]));
      const items = session.cart.map(line => {
        const product = catalogue.get(line.productId);
        const variant = product?.variants.find(v => v.size === line.size && v.color === line.color);
        if (!product || !variant || variant.stock < line.quantity) throw new Error("Sorry, one of your styles is no longer available in that quantity. Please update your bag.");
        variant.stock -= line.quantity;
        return { ...line, name: product.name, price: product.price };
      });
      const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const shipping = customer.delivery === "pickup" || subtotal >= 999 ? 0 : 49;
      const id = `VM-${crypto.randomUUID().slice(0, 8).toUpperCase()}`;
      await tx.insert(orders).values({ id, sessionId, customer: { ...customer, name: customer.name.trim(), email: customer.email.toLowerCase().trim() }, items, total: subtotal + shipping, paymentMethod: body.paymentMethod });
      for (const productId of new Set(items.map(i => i.productId))) {
        await tx.update(products).set({ data: catalogue.get(productId)! }).where(eq(products.id, productId));
      }
      await tx.update(shoppingSessions).set({ cart: [], updatedAt: new Date() }).where(eq(shoppingSessions.id, sessionId));
      return { orderId: id, total: subtotal + shipping, items, prototype: true };
    });
    return Response.json(result);
  } catch (error) { return errorResponse(error); }
}
