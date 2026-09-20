import { db } from "@/db";
import { subscribers } from "@/db/schema";
import { errorResponse } from "@/lib/server-store";
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 180) throw new Error("Please enter a valid email address.");
    await db.insert(subscribers).values({ email }).onConflictDoNothing();
    return Response.json({ message: "You're on the list. Thanks for joining the Siwan style circle!" });
  } catch (error) { return errorResponse(error); }
}
