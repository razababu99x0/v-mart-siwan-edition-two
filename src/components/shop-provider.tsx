"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { Check, X } from "lucide-react";
import { CATALOG } from "@/lib/catalog";
import type { CartLine, Product, ShopState } from "@/lib/types";

type ShopContextType = ShopState & {
  ready: boolean; pending: boolean; cartOpen: boolean; setCartOpen: (value: boolean) => void;
  wishlistOpen: boolean; setWishlistOpen: (value: boolean) => void; searchOpen: boolean; setSearchOpen: (value: boolean) => void;
  quickProduct: {product: Product; color: string} | null; setQuickProduct: (value: {product: Product; color: string} | null) => void;
  language: "en" | "hi"; setLanguage: (value: "en" | "hi") => void; t: (en: string, hi: string) => string;
  notify: (message: string) => void; refresh: () => Promise<void>;
  addToCart: (product: Product, size: string, color: string) => Promise<boolean>;
  addLook: (items: CartLine[]) => Promise<boolean>;
  updateQuantity: (line: CartLine, quantity: number) => Promise<boolean>; removeItem: (line: CartLine) => Promise<boolean>;
  toggleWishlist: (id: string) => Promise<boolean>;
};
const ShopContext = createContext<ShopContextType | null>(null);
export function ShopProvider({children}: {children: ReactNode}) {
  const [state, setState] = useState<ShopState>({cart:[],wishlist:[],products:CATALOG});
  const [ready,setReady] = useState(false); const [pending,setPending] = useState(false);
  const [cartOpen,setCartOpen] = useState(false); const [wishlistOpen,setWishlistOpen] = useState(false); const [searchOpen,setSearchOpen] = useState(false);
  const [quickProduct,setQuickProduct] = useState<{product:Product;color:string}|null>(null);
  const [language,setLanguage] = useState<"en"|"hi">("en"); const [toast,setToast] = useState("");
  const queue = useRef<Promise<void>>(Promise.resolve()); const initialLoad = useRef<Promise<void>>(Promise.resolve());
  const notify = useCallback((message: string) => setToast(message), []);
  const refresh = useCallback(async () => {
    try { const response = await fetch("/api/shop", {cache:"no-store"}); const data = await response.json(); if (!response.ok) throw new Error(data.error); setState(data); }
    catch { notify("We couldn't connect to your bag. Please try again."); }
    finally { setReady(true); }
  },[notify]);
  useEffect(() => { initialLoad.current = refresh(); },[refresh]);
  useEffect(() => { try { if (localStorage.getItem("vmart-language") === "hi") setLanguage("hi"); } catch {} }, []);
  useEffect(() => { document.documentElement.lang = language; try { localStorage.setItem("vmart-language", language); } catch {} },[language]);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(""), 4200); return () => clearTimeout(timer); }, [toast]);
  function mutate(payload: Record<string, unknown>) {
    const task = queue.current.then(async () => {
      await initialLoad.current; setPending(true);
      try { const response = await fetch("/api/shop",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload)}); const data = await response.json(); if (!response.ok) throw new Error(data.error); setState(data); return true; }
      catch (error) { notify(error instanceof Error ? error.message : "Please try again."); return false; }
      finally { setPending(false); }
    });
    queue.current = task.then(() => {}); return task;
  }
  const value: ShopContextType = {...state,ready,pending,cartOpen,setCartOpen,wishlistOpen,setWishlistOpen,searchOpen,setSearchOpen,quickProduct,setQuickProduct,language,setLanguage,t:(en,hi)=>language==="hi"?hi:en,notify,refresh,
    addToCart: async (product,size,color) => { const success = await mutate({action:"add",productId:product.id,size,color,quantity:1}); if (success) { setQuickProduct(null);setCartOpen(true); } return success; },
    addLook: async items => { const success = await mutate({action:"addMany",items}); if (success) { setQuickProduct(null); setCartOpen(true); } return success; },
    updateQuantity: (line,quantity) => mutate({action:"quantity",...line,quantity}), removeItem: line => mutate({action:"remove",...line}),
    toggleWishlist: id => mutate({action:"wishlist",productId:id}),
  };
  return <MotionConfig reducedMotion="user"><ShopContext.Provider value={value}>{children}<AnimatePresence>{toast && <motion.div role="status" className="toast" initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:10}}><Check size={18}/><span>{toast}</span><button aria-label="Dismiss notification" onClick={()=>setToast("")}><X size={16}/></button></motion.div>}</AnimatePresence></ShopContext.Provider></MotionConfig>;
}
export function useShop() { const context = useContext(ShopContext); if (!context) throw new Error("useShop requires ShopProvider"); return context; }
