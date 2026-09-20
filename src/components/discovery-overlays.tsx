"use client";
import dynamic from "next/dynamic";
const StyleStudio = dynamic(() => import("./style-studio").then(module => module.StyleStudio), { ssr: false });
const LookBuilder = dynamic(() => import("./look-builder").then(module => module.LookBuilder), { ssr: false });
export function DiscoveryOverlays() { return <><StyleStudio/><LookBuilder/></>; }
