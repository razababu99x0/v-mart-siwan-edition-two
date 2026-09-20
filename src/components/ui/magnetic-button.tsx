"use client";
import { motion, useReducedMotion, useSpring } from "motion/react";
import type { ReactNode } from "react";
export function MagneticButton({children,className,onClick}:{children:ReactNode;className:string;onClick:()=>void}) {
  const x=useSpring(0,{stiffness:320,damping:23});const y=useSpring(0,{stiffness:320,damping:23});const reduced=useReducedMotion();
  return <motion.button className={className} style={{x,y}} onClick={onClick} onPointerMove={event=>{if(reduced||event.pointerType!=="mouse")return;const rect=event.currentTarget.getBoundingClientRect();x.set((event.clientX-rect.left-rect.width/2)*.07);y.set((event.clientY-rect.top-rect.height/2)*.12);}} onPointerLeave={()=>{x.set(0);y.set(0);}} whileTap={{scale:.97}} whileHover={className.includes("button-primary")?{boxShadow:"0 8px 32px #e11d4840"}:{borderColor:"#cab8c0"}}>{children}</motion.button>;
}
