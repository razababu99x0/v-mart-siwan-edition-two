import { db } from "@/db";
import { products, shoppingSessions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { CATALOG } from "./catalog";

export async function getProducts() {
  if (!process.env.DATABASE_URL) return CATALOG;
  const rows = await db.select().from(products);
  if (!rows.length) {
    await db.insert(products).values(CATALOG.map(data => ({ id: data.id, data }))).onConflictDoNothing();
    return CATALOG;
  }
  return rows.map(row => row.data).sort((a, b) => CATALOG.findIndex(p => p.id === a.id) - CATALOG.findIndex(p => p.id === b.id));
}
export async function getProduct(slug: string) {
  return (await getProducts()).find(p => p.slug === slug);
}
export async function getSessionId() {
  const jar = await cookies();
  let id = jar.get("vmart-session")?.value;
  if (!id || !/^[0-9a-f-]{36}$/.test(id)) {
    id = crypto.randomUUID();
    jar.set("vmart-session", id, { httpOnly: true, sameSite: "lax", path: "/", maxAge: 60 * 60 * 24 * 90, secure: process.env.NODE_ENV === "production" });
  }
  await db.insert(shoppingSessions).values({ id }).onConflictDoNothing();
  return id;
}
export async function getSession() {
  const id = await getSessionId();
  const [session] = await db.select().from(shoppingSessions).where(eq(shoppingSessions.id, id));
  return session;
}
export function errorResponse(error: unknown, fallback = "Something went wrong. Please try again.") {
  const message = error instanceof Error ? error.message : fallback;
  const known = message.startsWith("Please") || message.startsWith("Sorry") || message.startsWith("Your") || message.startsWith("Choose");
  if (!known) console.error("Store request failed:", error);
  return Response.json({ error: known ? message : fallback }, { status: known ? 400 : 500 });
}
