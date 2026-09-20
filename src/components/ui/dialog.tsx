"use client";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { X } from "lucide-react";
import { useEffect, useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";
type Props={open:boolean;onOpenChange:(open:boolean)=>void;title:string;description?:string;children:ReactNode;className?:string;sheet?:boolean};
export function Dialog({open,onOpenChange,title,description,children,className,sheet=false}:Props) {
  const reduced=useReducedMotion();const returnFocus=useRef<HTMLElement|null>(typeof document !== "undefined" ? document.activeElement as HTMLElement : null);
  useEffect(()=>{function rememberFocus(event:FocusEvent){const target=event.target;if(target instanceof HTMLElement&&!target.closest('[role="dialog"]'))returnFocus.current=target;}document.addEventListener("focusin",rememberFocus);return()=>document.removeEventListener("focusin",rememberFocus);},[]);
  return <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}><AnimatePresence>{open&&<DialogPrimitive.Portal key="dialog" forceMount>
    <DialogPrimitive.Overlay asChild forceMount><motion.div className="dialog-overlay" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} transition={{duration:.2}}/></DialogPrimitive.Overlay>
    <DialogPrimitive.Content asChild forceMount {...(!description?{"aria-describedby":undefined}:{})} onCloseAutoFocus={event=>{event.preventDefault();if(returnFocus.current?.isConnected)returnFocus.current.focus({preventScroll:true});}}>
      <motion.div className={cn("dialog-content",sheet?"dialog-sheet":"dialog-modal",className)} initial={reduced?{opacity:0}:sheet?{x:"100%"}:{opacity:0,y:20,scale:.98}} animate={{opacity:1,x:0,y:0,scale:1}} exit={reduced?{opacity:0}:sheet?{x:"100%"}:{opacity:0,y:10,scale:.98}} transition={{type:"spring",stiffness:320,damping:32}}>
        <div className="dialog-heading"><div><DialogPrimitive.Title>{title}</DialogPrimitive.Title>{description&&<DialogPrimitive.Description>{description}</DialogPrimitive.Description>}</div><DialogPrimitive.Close className="icon-button close-button" aria-label="Close dialog"><X size={21}/></DialogPrimitive.Close></div>{children}
      </motion.div>
    </DialogPrimitive.Content>
  </DialogPrimitive.Portal>}</AnimatePresence></DialogPrimitive.Root>;
}
