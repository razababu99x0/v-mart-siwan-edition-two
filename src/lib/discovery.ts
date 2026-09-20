import type { Category, Product } from "./types";
export type StyleCategory = Category | "Everyone";
export type StyleMood = "everyday" | "weekend" | "celebration";
export type StylePreferences = { category: StyleCategory; mood: StyleMood; budget: number };
export type StylePick = { productId: string; reason: string };
export type StyleProfile = { preferences: StylePreferences | null; picks: StylePick[]; savedAt: string | null };
export type LookBundle = { id: string; title: string; description: string; image: string; productIds: string[] };
export const STYLE_CATEGORIES: StyleCategory[] = ["Everyone", "Women", "Men", "Kids", "Infants"];
export const STYLE_BUDGETS = [499, 799, 999, 1499, 1999];
export const STYLE_MOODS: { id: StyleMood; label: string; description: string; image: string }[] = [
  { id: "everyday", label: "Everyday, elevated", description: "Good basics. Great possibilities.", image: "/images/category-men.jpg" },
  { id: "weekend", label: "Off-duty energy", description: "Easy fits, wherever the day goes.", image: "/images/product-denim.jpg" },
  { id: "celebration", label: "A little occasion", description: "Warm colours. Thoughtful details.", image: "/images/category-women.jpg" },
];
const EDIT_NOTES: Record<string, { moods: StyleMood[]; reason: string }> = {
  "linen-shirt": { moods: ["everyday", "celebration"], reason: "Airy texture that dresses up or down." },
  "floral-kurta": { moods: ["celebration", "everyday"], reason: "A warm floral print with an easy, modern fit." },
  "textured-tee": { moods: ["weekend", "everyday"], reason: "Soft cotton and a relaxed off-duty silhouette." },
  "kids-set": { moods: ["weekend", "everyday"], reason: "A ready-to-go set for their next little adventure." },
  "baby-knit": { moods: ["everyday", "celebration"], reason: "Gentle ribbed layers for tiny everyday moments." },
  "wide-denim": { moods: ["weekend", "everyday"], reason: "One flattering shape. A hundred ways to wear it." },
  "court-sneakers": { moods: ["weekend", "everyday"], reason: "A clean, comfortable finish for your rotation." },
  "baby-top": { moods: ["everyday", "weekend"], reason: "An extra-soft essential that keeps things simple." },
};
export function curateStyles(products: Product[], preferences: StylePreferences): StylePick[] {
  return products.filter(product => (preferences.category === "Everyone" || product.category === preferences.category) && product.price <= preferences.budget && product.variants.some(variant => variant.stock > 0))
    .map(product => ({ product, score: (EDIT_NOTES[product.id]?.moods[0] === preferences.mood ? 4 : EDIT_NOTES[product.id]?.moods.includes(preferences.mood) ? 2 : 0) }))
    .sort((a, b) => b.score - a.score || a.product.price - b.product.price)
    .slice(0, 4).map(({ product }) => ({ productId: product.id, reason: EDIT_NOTES[product.id]?.reason ?? "A considered addition to your everyday wardrobe." }));
}
export const LOOK_BUNDLES: LookBundle[] = [
  { id: "everyday-duo", title: "The everyday duo", description: "A little linen. The perfect denim. Two easy pieces, one shared mood.", image: "/images/editorial-look.jpg", productIds: ["linen-shirt", "wide-denim"] },
  { id: "weekend-uniform", title: "The weekend uniform", description: "Rich cotton texture and clean court sneakers. Consider your off-duty rotation sorted.", image: "/images/product-tee.jpg", productIds: ["textured-tee", "court-sneakers"] },
];
