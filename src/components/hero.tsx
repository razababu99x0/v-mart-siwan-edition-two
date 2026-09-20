"use client";
import dynamic from "next/dynamic";
import { useRef, useState } from "react";
import { AnimatePresence, motion, useInView, useMotionTemplate, useReducedMotion, useSpring } from "motion/react";
import { ArrowDown, ArrowRight, ArrowUpRight, Check, Maximize2, Rotate3D, ShoppingBag, Sparkles } from "lucide-react";
import { useShop } from "./shop-provider";
import { useDiscovery } from "./discovery-provider";
import { scrollToSection } from "./motion-utils";
import { MagneticButton } from "./ui/magnetic-button";
import { SceneAtelier } from "./scene-atelier";
import { BAG_FINISHES, type BagFinish } from "@/lib/scene";
import { LOOK_BUNDLES } from "@/lib/discovery";
import { money } from "@/lib/types";
import { BagPoster } from "./bag-poster";
const BagScene = dynamic(() => import("./bag-scene"), { ssr: false, loading: () => <BagPoster/> });
const CAMPAIGNS = [
  { id: "everyday", label: "The everyday edit", sublabel: "LESS ORDINARY. MORE YOU.", image: "/images/hero-campaign.jpg", thumbnail: "/images/category-men.jpg", number: "01", caption: "Less ordinary.", italic: "More you." },
  { id: "celebration", label: "The celebration edit", sublabel: "LITTLE MOMENTS. BIG ENERGY.", image: "/images/festive-campaign.jpg", thumbnail: "/images/category-women.jpg", number: "02", caption: "Good times.", italic: "Great style." },
];
export function Hero() {
  const { t, products, setQuickProduct } = useShop(); const { setStudioOpen, setBundle } = useDiscovery();
  const [campaign, setCampaign] = useState(0); const [expanded, setExpanded] = useState(false); const [finish, setFinish] = useState<BagFinish>("scarlet");
  const ref = useRef<HTMLElement>(null); const objectRef = useRef<HTMLDivElement>(null); const inView = useInView(objectRef, { margin: "80px" }); const reduced = useReducedMotion();
  const lightX = useSpring(57, { stiffness: 65, damping: 25 }); const lightY = useSpring(43, { stiffness: 65, damping: 25 });
  const glow = useMotionTemplate`radial-gradient(ellipse at ${lightX}% ${lightY}%, rgba(225,29,72,.14), transparent 57%)`;
  const current = CAMPAIGNS[campaign];
  function shopEdit() { if (campaign === 0) setBundle(LOOK_BUNDLES[0]); else { const product = products.find(item => item.id === "floral-kurta"); if (product) setQuickProduct({ product, color: product.colors[0].name }); } }
  return <>
    <section ref={ref} className={`hero hero-edition hero-mood-${current.id}`} aria-labelledby="hero-heading" onPointerMove={event => { if (reduced || event.pointerType !== "mouse") return; const box = event.currentTarget.getBoundingClientRect(); lightX.set(45 + ((event.clientX - box.left) / box.width) * 30); lightY.set(25 + ((event.clientY - box.top) / box.height) * 45); }}>
      <AnimatePresence initial={false}><motion.img key={current.image} className="hero-photo" src={current.image} alt={campaign === 0 ? "Confident new-season layers: rich burgundy, natural cream and effortless Siwan style" : "Modern red and ivory festive styles for moments worth dressing up for"} fetchPriority={campaign === 0 ? "high" : "auto"} width={1568} height={882} initial={{ opacity: 0, scale: reduced ? 1 : 1.025 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: .7, ease: [.22, 1, .36, 1] }}/></AnimatePresence>
      <div className="hero-shade"/><motion.div className="edition-pointer-glow" style={{ background: glow }} aria-hidden="true"/><div className="edition-grain" aria-hidden="true"/><div className="edition-photo-frame" aria-hidden="true"><span/><span/><span/><span/></div>
      <div className="hero-season"><span>STYLE IN MOTION<br/>THE SIWAN ISSUE</span><span className="season-year">02<span>/ 26</span></span></div><div className="hero-side-label">YOUR CITY. YOUR PEOPLE. YOUR V-MART.</div>
      <div className="hero-content"><motion.div className="edition-issue-label" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: .5 }}><span className="edition-issue-dot"/>THE NEW SEASON IS A STATE OF MIND.<span>EVERYDAY, REDEFINED.</span></motion.div>
        <h1 id="hero-heading" className="hero-title">{[t("SIWAN,", "सीवान,"), t("MEET YOUR", "मिलिए अपने"), t("NEXT LOOK.", "नए लुक से।")].map((line, index) => <span className="hero-line" key={line}><motion.span initial={{ y: reduced ? 0 : "108%", opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: .78, delay: .1 + index * .1, ease: [.22, 1, .36, 1] }} className={index === 2 ? "red-text" : ""}>{line}</motion.span></span>)}</h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: .4, duration: .7 }}><p className="hero-description"><strong>{t("Everyday fashion. Standout style.", "हर दिन का फ़ैशन। सबसे अलग अंदाज़।")}</strong><br/>{t("For every version of you. Right here in Siwan.", "आपके हर रंग के लिए। आपके अपने सीवान में।")}</p><div className="hero-ctas"><MagneticButton className="button button-primary" onClick={() => scrollToSection("arrivals")}>{t("Shop new arrivals", "नए स्टाइल खरीदें")}<ArrowUpRight size={19}/></MagneticButton><MagneticButton className="button button-hero-outline" onClick={() => scrollToSection("categories")}>{t("Explore collections", "कलेक्शन देखें")}<ArrowRight size={18}/></MagneticButton></div><button className="hero-studio-link" onClick={() => setStudioOpen(true)}><span className="hero-studio-icon"><Sparkles size={14}/></span><span>A little more <em>you.</em> Find your personal edit.</span><ArrowUpRight size={14}/></button></motion.div>
      </div>
      <div className="hero-object edition-object" ref={objectRef}><div className="edition-object-orbit" aria-hidden="true"/><div className="hero-object-glow"/>{inView && !expanded && <BagScene finish={finish}/>}<button className="scene-label" aria-label="STYLE IN 3D" onClick={() => setExpanded(true)}><Rotate3D size={15}/><span>ENTER THE 3D ATELIER</span><Maximize2 size={12}/></button><span className="edition-object-caption">A LITTLE ATTITUDE. EVERY ANGLE.</span></div>
      <motion.button className="hero-editorial-tag edition-edit-card" onClick={shopEdit} whileHover={{ y: -5, backgroundColor: "rgba(35,24,29,.7)" }} whileTap={{ scale: .98 }} aria-label={`Shop ${current.label}`}><span className="tag-top">{current.label.toUpperCase()}<ArrowUpRight size={18}/></span><AnimatePresence mode="wait"><motion.strong key={current.id} initial={{ opacity: 0, y: reduced ? 0 : 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: .25 }}>{current.caption}<br/><em>{current.italic}</em></motion.strong></AnimatePresence><span className="edition-edit-card-bottom"><span className="edition-edit-thumbnails"><img src={current.thumbnail} alt="" width={34} height={42}/>{campaign === 0 && <img src="/images/product-denim.jpg" alt="" width={34} height={42}/>}</span><span>{campaign === 0 ? "BUILD THE LOOK" : "FIND YOUR FESTIVE FIT"}<small>{campaign === 0 ? "Two pieces. One shared mood." : `Fresh festive finds from ${money(799)}`}</small></span><span className="edition-edit-plus">+</span></span></motion.button>
      <div className="hero-bottom edition-hero-bottom"><button className="hero-scroll" aria-label="Scroll to the collections" onClick={() => scrollToSection("categories")}><motion.span animate={reduced ? {} : { y: [0, 4, 0] }} transition={{ duration: 1.8, repeat: 2 }}><ArrowDown size={17}/></motion.span><span>FIND YOUR NEXT CHAPTER</span></button><div className="edition-campaign-tabs" role="group" aria-label="Choose a campaign mood">{CAMPAIGNS.map((item, index) => <button key={item.id} aria-pressed={campaign === index} className={campaign === index ? "active" : ""} onClick={() => setCampaign(index)}><span>{item.number}</span><span>{item.label}</span>{campaign === index && <motion.span className="edition-campaign-indicator" layoutId="hero-campaign-indicator" transition={{ type: "spring", stiffness: 320, damping: 30 }}/>}</button>)}</div><span className="hero-location"><span className="edition-local-dot"/>SIWAN, BIHAR<span>26.22° N / 84.36° E</span></span></div>
    </section>
    <SceneAtelier open={expanded} onOpenChange={setExpanded} finish={finish} onFinishChange={setFinish}/>
  </>;
}
