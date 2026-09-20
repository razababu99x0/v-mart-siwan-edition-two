import Link from "next/link";
import { ArrowRight, Search } from "lucide-react";
export default function NotFound(){return <main id="main-content" className="not-found-page container"><span className="eyebrow">A LITTLE DETOUR / 404</span><h1>THIS LOOK<br/>GOT AWAY<span>.</span></h1><p>That page isn’t in our collection. Your next favourite still is.</p><Link href="/" className="button button-primary">Back to the good stuff<ArrowRight size={18}/></Link></main>;}
