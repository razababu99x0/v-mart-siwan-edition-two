"use client";
import { animate, motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";
export function Reveal({children, className="", delay=0}: {children:ReactNode;className?:string;delay?:number}) {
  const reduced = useReducedMotion();
  return <motion.div className={className} initial={{opacity:0,y:reduced?0:24}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.08}} transition={{duration:.55,delay:reduced?0:delay,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
export function scrollToSection(id: string) {
  const target = document.getElementById(id); if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - 100;
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { window.scrollTo(0,top); return; }
  animate(window.scrollY,top,{duration:.65,ease:[.22,1,.36,1],onUpdate:value=>window.scrollTo(0,value)});
}
