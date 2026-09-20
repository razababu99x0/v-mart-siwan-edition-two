import { db } from "@/db";
import { styleProfiles } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getProducts, getSessionId, errorResponse } from "@/lib/server-store";
import { curateStyles, STYLE_BUDGETS, STYLE_CATEGORIES, STYLE_MOODS, type StylePreferences } from "@/lib/discovery";

export const dynamic = "force-dynamic";
export async function GET() {
  try {
    const id = await getSessionId();
    const [profile] = await db.select().from(styleProfiles).where(eq(styleProfiles.sessionId, id));
    if (!profile) return Response.json({ preferences: null, picks: [], savedAt: null });
    return Response.json({ preferences: profile.preferences, picks: curateStyles(await getProducts(), profile.preferences), savedAt: profile.updatedAt.toISOString() });
  } catch (error) { return errorResponse(error, "Couldn't load your style edit. Please try again."); }
}
export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body || !STYLE_CATEGORIES.includes(body.category) || !STYLE_MOODS.some(mood => mood.id === body.mood) || !STYLE_BUDGETS.includes(body.budget)) throw new Error("Please choose a category, mood and one of the available budgets.");
    const preferences: StylePreferences = { category: body.category, mood: body.mood, budget: body.budget };
    const sessionId = await getSessionId();
    const savedAt = new Date();
    await db.insert(styleProfiles).values({ sessionId, preferences, updatedAt: savedAt }).onConflictDoUpdate({ target: styleProfiles.sessionId, set: { preferences, updatedAt: savedAt } });
    return Response.json({ preferences, picks: curateStyles(await getProducts(), preferences), savedAt: savedAt.toISOString() });
  } catch (error) { return errorResponse(error, "Couldn't save your style edit. Please try again."); }
}
export async function DELETE() {
  try {
    const id = await getSessionId();
    await db.delete(styleProfiles).where(eq(styleProfiles.sessionId, id));
    return Response.json({ preferences: null, picks: [], savedAt: null });
  } catch (error) { return errorResponse(error, "Couldn't clear your style preferences. Please try again."); }
}
