"use client";
import { useRef } from "react";
import Link from "next/link";
import { animate, useReducedMotion } from "motion/react";
import { ArrowLeft, ArrowRight, ArrowUpRight, Clock3, X } from "lucide-react";
import { useDiscovery } from "./discovery-provider";
import { useShop } from "./shop-provider";
import { money } from "@/lib/types";
export function RecentlyViewed({ excludeId }: { excludeId?: string }) {
  const { viewedIds, clearViewed } = useDiscovery(); const { products, setQuickProduct } = useShop();
  const ref = useRef<HTMLDivElement>(null); const reduced = useReducedMotion();
  const viewed = viewedIds.filter(id => id !== excludeId).flatMap(id => { const product = products.find(p => p.id === id); return product ? [product] : []; });
  if (!viewed.length) return null;
  function scroll(direction: number) { const element = ref.current; if (!element) return; const target = Math.max(0, Math.min(element.scrollWidth - element.clientWidth, element.scrollLeft + direction * 300)); if (reduced) element.scrollLeft = target; else animate(element.scrollLeft, target, { duration: .4, ease: [.22, 1, .36, 1], onUpdate: value => { element.scrollLeft = value; } }); }
  return <section className="recently-viewed" aria-labelledby={`recently-viewed-${excludeId ?? "home"}`}><div className="recently-viewed-heading"><div><span className="eyebrow"><Clock3 size={14}/>STILL ON YOUR MIND?</span><h3 id={`recently-viewed-${excludeId ?? "home"}`}>A second look never hurts.</h3></div><div><button className="recent-clear" onClick={clearViewed}>Clear history<X size={13}/></button><button className="icon-button" aria-label="Previous recently viewed styles" onClick={() => scroll(-1)}><ArrowLeft size={17}/></button><button className="icon-button" aria-label="Next recently viewed styles" onClick={() => scroll(1)}><ArrowRight size={17}/></button></div></div><div className="recently-viewed-track" ref={ref}>{viewed.map(product => <article className="recent-product" key={product.id}><Link href={`/product/${product.slug}`}><img src={product.image} alt={product.name} width={83} height={108}/></Link><div><span>{product.category}</span><Link href={`/product/${product.slug}`}>{product.name}</Link><strong>{money(product.price)}</strong><button onClick={() => setQuickProduct({ product, color: product.colors[0].name })}>Make it yours<ArrowUpRight size={13}/></button></div></article>)}</div><p className="recently-viewed-note">Remembered only on this device. Always yours to clear.</p></section>;
}
