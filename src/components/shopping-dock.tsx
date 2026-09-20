"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { motion } from "motion/react";
import { Heart, House, LayoutGrid, ShoppingBag, Sparkles } from "lucide-react";
import { useShop } from "./shop-provider";
import { useDiscovery } from "./discovery-provider";
import { scrollToSection } from "./motion-utils";
export function ShoppingDock() {
  const pathname = usePathname(); const router = useRouter();
  const { cart, wishlist, setCartOpen, setWishlistOpen, t } = useShop(); const { setStudioOpen, studioOpen, bundle } = useDiscovery();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  if (pathname !== "/") return null;
  return <nav className="shopping-dock" aria-label="Mobile shopping shortcuts"><Link href="/" aria-label="Home" aria-current="page"><House size={19}/><span>{t("Home", "होम")}</span></Link><button onClick={() => pathname === "/" ? scrollToSection("categories") : router.push("/#categories")} aria-label="Browse collections"><LayoutGrid size={19}/><span>{t("Explore", "खोजें")}</span></button><motion.button className="dock-studio" whileTap={{ scale: .92 }} aria-label="Open Style Studio" onClick={() => setStudioOpen(true)}><span><Sparkles size={22}/></span><small>{t("Your edit", "आपका एडिट")}</small></motion.button><button aria-label={`Saved styles, ${wishlist.length} items`} onClick={() => setWishlistOpen(true)}><span className="dock-icon"><Heart size={19}/>{wishlist.length > 0 && <b>{wishlist.length}</b>}</span><span>{t("Saved", "पसंद")}</span></button><button aria-label={`Shopping bag, ${count} items`} onClick={() => setCartOpen(true)}><span className="dock-icon"><ShoppingBag size={19}/>{count > 0 && <b>{count}</b>}</span><span>{t("Bag", "बैग")}</span></button></nav>;
}
