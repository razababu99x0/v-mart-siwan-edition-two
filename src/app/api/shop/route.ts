import { db } from "@/db";
import { shoppingSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getProducts, getSession, getSessionId, errorResponse } from "@/lib/server-store";
import type { CartLine } from "@/lib/types";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const [session, products] = await Promise.all([getSession(), getProducts()]);
    return Response.json({ cart: session.cart, wishlist: session.wishlist, products });
  } catch (error) { return errorResponse(error); }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || typeof body.action !== "string") throw new Error("Please choose a valid shopping action.");
    const id = await getSessionId();
    const products = await getProducts();
    const state = await db.transaction(async tx => {
      const [session] = await tx.select().from(shoppingSessions).where(eq(shoppingSessions.id, id)).for("update");
      let cart = [...session.cart];
      let wishlist = [...session.wishlist];
      function applyLine(input: unknown, replace = false) {
        if (!input || typeof input !== "object") throw new Error("Please choose a valid product variant.");
        const item = input as Record<string, unknown>;
        const product = products.find(p => p.id === item.productId);
        if (!product) throw new Error("Sorry, this style is no longer available.");
        const variant = product.variants.find(v => v.size === item.size && v.color === item.color);
        const quantity = item.quantity === undefined ? 1 : item.quantity;
        if (typeof quantity !== "number" || !Number.isInteger(quantity) || quantity < 1 || quantity > 10) throw new Error("Please choose a quantity between 1 and 10.");
        const index = cart.findIndex(line => line.productId === product.id && line.size === item.size && line.color === item.color);
        const nextQuantity = replace ? quantity : (cart[index]?.quantity ?? 0) + quantity;
        if (nextQuantity > 10) throw new Error("Please keep each variant to 10 items or fewer.");
        if (!variant || nextQuantity > variant.stock) throw new Error(`Sorry, ${product.name} is not available in that size, colour or quantity.`);
        const line: CartLine = { productId: product.id, size: variant.size, color: variant.color, quantity: nextQuantity };
        if (index < 0) cart.push(line); else cart[index] = line;
      }
      if (body.action === "addMany") {
        if (!Array.isArray(body.items) || body.items.length < 1 || body.items.length > 6) throw new Error("Please select between 1 and 6 pieces for your look.");
        body.items.forEach((item: unknown) => applyLine(item));
      } else if (body.action === "wishlist") {
        const product = products.find(p => p.id === body.productId);
        if (!product) throw new Error("Sorry, this style is no longer available.");
        wishlist = wishlist.includes(product.id) ? wishlist.filter(x => x !== product.id) : [...wishlist, product.id];
      } else if (body.action === "clear") { cart = []; }
      else if (body.action === "remove") {
        cart = cart.filter(line => !(line.productId === body.productId && line.size === body.size && line.color === body.color));
      } else if (body.action === "add" || body.action === "quantity") { applyLine(body, body.action === "quantity"); }
      else throw new Error("Please choose a valid shopping action.");
      await tx.update(shoppingSessions).set({ cart, wishlist, updatedAt: new Date() }).where(eq(shoppingSessions.id, id));
      return { cart, wishlist, products };
    });
    return Response.json(state);
  } catch (error) { return errorResponse(error); }
}
