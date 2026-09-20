"use client";
import { useState } from "react";
import { motion } from "motion/react";
import { ArrowRight, Check, Layers, ShoppingBag, Minus, Plus, ShieldCheck } from "lucide-react";
import { useDiscovery } from "./discovery-provider";
import { useShop } from "./shop-provider";
import { Dialog } from "./ui/dialog";
import { Button } from "./ui/button";
import { money, type CartLine } from "@/lib/types";
import type { LookBundle } from "@/lib/discovery";

type Selection = { included: boolean; size: string; color: string };
function Builder({ look }: { look: LookBundle }) {
  const { products, addLook, pending, ready } = useShop();
  const { setBundle } = useDiscovery();
  const pieces = look.productIds.flatMap(id => { const product = products.find(p => p.id === id); return product ? [product] : []; });
  const [selection, setSelection] = useState<Record<string, Selection>>(() => Object.fromEntries(pieces.map(product => [product.id, { included: true, size: "", color: product.colors[0].name }])));
  const [error, setError] = useState("");
  const selected = pieces.filter(product => selection[product.id]?.included);
  const total = selected.reduce((sum, product) => sum + product.price, 0);
  const complete = selected.length > 0 && selected.every(product => { const chosen = selection[product.id]; return product.variants.some(v => v.color === chosen.color && v.size === chosen.size && v.stock > 0); });
  function update(id: string, change: Partial<Selection>) { setSelection(current => ({ ...current, [id]: { ...current[id], ...change } })); setError(""); }
  async function add() {
    if (!complete) { setError("Choose an available size for every selected piece."); return; }
    const items: CartLine[] = selected.map(product => ({ productId: product.id, size: selection[product.id].size, color: selection[product.id].color, quantity: 1 }));
    if (await addLook(items)) setBundle(null);
  }
  return <div className="look-builder-layout"><div className={`look-builder-image ${look.id === "weekend-uniform" ? "is-weekend" : ""}`}><img src={look.image} alt={look.title + " — editorial outfit inspiration"} width={640} height={820}/><div className="look-builder-image-caption"><span>THE COMPLETE MOOD</span><h3>{look.title}</h3><p>{look.description}</p></div><span className="look-builder-image-number">0{look.id === "everyday-duo" ? "1" : "2"}</span></div><div className="look-builder-selection"><div className="look-builder-intro"><span className="eyebrow"><Layers size={14}/>PICK THE PIECES. MAKE THEM YOURS.</span><p>Choose each fit. Skip anything you don’t need.<br/>Your bag, your rules.</p></div><div className="look-builder-pieces">{pieces.map((product, index) => { const chosen = selection[product.id]; return <article className={`look-builder-piece ${!chosen.included ? "is-excluded" : ""}`} key={product.id}><div className="look-piece-heading"><label><input type="checkbox" checked={chosen.included} onChange={e => update(product.id, { included: e.target.checked })}/><span className="look-piece-index">0{index + 1}</span><strong>{product.name}</strong></label><strong>{money(product.price)}</strong></div><div className="look-piece-body"><img src={product.image} alt={product.name} width={85} height={113}/><div><label className="look-piece-colour">Colour<select aria-label={`${product.name} colour`} value={chosen.color} disabled={!chosen.included || pending} onChange={e => update(product.id, { color: e.target.value, size: "" })}>{product.colors.map(color => <option key={color.name} value={color.name}>{color.name}</option>)}</select></label><div className="look-piece-sizes-label">Size <span>{chosen.size || "Select your fit"}</span></div><div className="size-grid" role="group" aria-label={`${product.name} size`}>{product.sizes.map(size => { const stock = product.variants.find(v => v.size === size && v.color === chosen.color)?.stock ?? 0; return <motion.button whileTap={{ scale: .95 }} key={size} className={chosen.size === size ? "selected" : ""} disabled={!chosen.included || pending || !stock} aria-pressed={chosen.size === size} onClick={() => update(product.id, { size })}>{size}</motion.button>; })}</div></div></div></article>; })}</div>{error && <p className="form-error" role="alert">{error}</p>}<div className="look-builder-total"><span>{selected.length} {selected.length === 1 ? "piece" : "pieces"}. All you.<small>Inclusive of taxes. No automatic bundle discount.</small></span><strong>{money(total)}</strong></div><Button className="full-width" onClick={() => void add()} disabled={!complete || pending || !ready}>{pending ? "Adding your look…" : !selected.length ? "Select at least one piece" : !complete ? "Choose a size for each piece" : `Add ${selected.length === 1 ? "this piece" : "the look"} to bag`}<ShoppingBag size={17}/></Button><p className="look-builder-note"><ShieldCheck size={14}/>All pieces are checked together. Nothing is added if a variant is unavailable.</p><p className="look-builder-disclaimer">Only the selected products are included. Other clothing and accessories in the editorial image are styling inspiration.</p></div></div>;
}
export function LookBuilder() {
  const { bundle, setBundle } = useDiscovery();
  return <Dialog open={!!bundle} onOpenChange={open => { if (!open) setBundle(null); }} title="One look. Your way." description="From inspiration to your bag, in one considered step." className="look-builder-dialog">{bundle && <Builder key={bundle.id} look={bundle}/>}</Dialog>;
}
