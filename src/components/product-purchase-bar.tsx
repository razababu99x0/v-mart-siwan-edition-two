"use client";
import { useEffect, useState, type RefObject } from "react";
import { AnimatePresence, motion, useInView, useMotionValueEvent, useScroll } from "motion/react";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { useShop } from "./shop-provider";
import { money, type Product } from "@/lib/types";
import { scrollToSection } from "./motion-utils";
export function ProductPurchaseBar({ product, size, color, purchaseRef, onAdd }: { product: Product; size: string; color: string; purchaseRef: RefObject<HTMLDivElement | null>; onAdd: () => void }) {
  const { pending, ready } = useShop(); const inlineVisible = useInView(purchaseRef, { amount: .25 }); const { scrollY } = useScroll();
  const [pastIntro, setPastIntro] = useState(false); const [mobile, setMobile] = useState(false);
  useMotionValueEvent(scrollY, "change", value => setPastIntro(value > 420));
  useEffect(() => { const query = window.matchMedia("(max-width: 767px)"); const update = () => setMobile(query.matches); update(); query.addEventListener("change", update); return () => query.removeEventListener("change", update); }, []);
  const variant = product.variants.find(item => item.size === size && item.color === color);
  return <AnimatePresence>{!inlineVisible && (mobile || pastIntro) && <motion.div className="product-purchase-bar" initial={{ y: "110%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: "110%", opacity: 0 }} transition={{ type: "spring", stiffness: 300, damping: 31 }}><div className="purchase-bar-inner"><img src={product.image} alt="" width={42} height={53}/><div><strong>{product.name}</strong><span>{size ? `${color} / ${size}` : "A little closer to your next favourite."}</span></div><strong className="purchase-bar-price">{money(product.price)}</strong><button className="button button-primary" disabled={!ready || pending || Boolean(size && !variant?.stock)} onClick={() => { if (size) onAdd(); else { scrollToSection("product-sizes"); document.getElementById("product-sizes")?.focus({ preventScroll: true }); } }}>{pending ? "Adding…" : size ? "Add to bag" : "Choose my fit"}{size ? <ShoppingBag size={16}/> : <ArrowRight size={16}/>}</button></div></motion.div>}</AnimatePresence>;
}
