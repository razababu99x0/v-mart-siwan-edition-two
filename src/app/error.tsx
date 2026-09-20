"use client";
import { ArrowRight, RotateCcw } from "lucide-react";
export default function ErrorPage({reset}:{reset:()=>void}){return <main id="main-content" className="not-found-page container"><span className="eyebrow">A SMALL PAUSE, NOT THE END.</span><h1>LET’S TRY<br/>THAT AGAIN<span>.</span></h1><p>We couldn’t load the collection just now. Your saved styles are still waiting.</p><button className="button button-primary" onClick={reset}>Reload the collection<RotateCcw size={17}/></button></main>;}
