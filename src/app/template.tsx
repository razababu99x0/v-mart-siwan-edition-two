"use client";
import { motion } from "motion/react";
import type { ReactNode } from "react";
export default function Template({children}:{children:ReactNode}){return <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:.25}}>{children}</motion.div>;}
