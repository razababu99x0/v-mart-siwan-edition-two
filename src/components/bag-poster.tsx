"use client";
import { useId } from "react";
import { BAG_FINISHES, type BagFinish } from "@/lib/scene";
export function BagPoster({ finish = "scarlet" }: { finish?: BagFinish }) {
  const id = useId().replace(/:/g, ""); const material = BAG_FINISHES.find(item => item.id === finish)!;
  return <div className="bag-fallback" role="img" aria-label={`${material.name} signature V-Mart bag illustration`}><svg viewBox="0 0 240 270" fill="none"><defs><linearGradient id={`bag-${id}`} x1="40" y1="70" x2="207" y2="250"><stop stopColor={material.color}/><stop offset=".55" stopColor={material.color}/><stop offset="1" stopColor="#381623"/></linearGradient></defs><g transform="rotate(-9 120 150)"><path d="M84 90V55C84 13 160 13 160 55V90" stroke={material.handle} strokeWidth="6"/><path d="M69 88V53C69 18 148 18 148 53V88" stroke={material.handle} strokeWidth="6"/><path d="M39 80H185L195 243H43Z" fill={`url(#bag-${id})`}/><path d="M185 80L205 88L212 233L195 243Z" fill={material.color}/><path d="M39 80H185L205 88H49Z" fill="#4b2733"/><text x="111" y="164" fill={material.text} fontSize="28" fontFamily="Arial" fontWeight="bold" textAnchor="middle">V-MART</text><text x="112" y="180" fill={material.text} fontSize="5.5" fontFamily="Arial" textAnchor="middle" letterSpacing="1.2">STYLE IN MOTION</text><path d="M44 85V235" stroke="white" strokeOpacity=".35" strokeWidth="2"/></g></svg></div>;
}
