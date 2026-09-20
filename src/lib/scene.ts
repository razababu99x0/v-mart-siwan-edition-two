export const BAG_FINISHES = [
  { id: "scarlet", name: "Signature scarlet", color: "#d91b44", text: "#fff9f0", handle: "#dabca1", description: "The V-Mart signature. A little bold, entirely you." },
  { id: "silver", name: "Liquid silver", color: "#c5c8ce", text: "#272329", handle: "#e2e1de", description: "Cool, considered, and never in the background." },
  { id: "champagne", name: "Soft champagne", color: "#c8a783", text: "#34251d", handle: "#f2d9b5", description: "A warmer perspective on an everyday icon." },
] as const;
export type BagFinish = typeof BAG_FINISHES[number]["id"];
export type SceneLighting = "studio" | "after-dark";
