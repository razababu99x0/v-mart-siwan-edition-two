import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Sans, Barlow_Condensed } from "next/font/google";
import { ShopProvider } from "@/components/shop-provider";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { CommerceOverlays } from "@/components/commerce-overlays";
import { DiscoveryProvider } from "@/components/discovery-provider";
import { DiscoveryOverlays } from "@/components/discovery-overlays";
import { ShoppingDock } from "@/components/shopping-dock";
import "./globals.css";
import "./refinements.css";
import "./edition-two.css";
const dmSans = DM_Sans({subsets:["latin"],variable:"--font-body",display:"swap"});
const barlow = Barlow_Condensed({subsets:["latin"],weight:["700","800"],variable:"--font-display",display:"swap"});
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {default:"V-Mart Siwan — Style in Motion",template:"%s | V-Mart Siwan"},
  description:"Siwan, meet your next look. Discover everyday fashion and standout style for men, women, kids and infants at V-Mart, Babunia More, Siwan. An interactive shopping prototype.",
  icons:{icon:"/icon.svg"},
  openGraph:{title:"V-Mart Siwan — Style in Motion",description:"Everyday fashion. Standout style. For every version of you.",images:["/images/hero-campaign.jpg"]},
};
export default function RootLayout({children}: {children:ReactNode}) {
  return <html lang="en" className={`${dmSans.variable} ${barlow.variable}`}><body><div role="note" style={{position:"fixed",bottom:0,left:0,right:0,zIndex:99999,textAlign:"center",padding:"6px 12px",background:"#111",color:"#fff",fontSize:12}}>Demo storefront · Orders and payments are unavailable</div><a href="#main-content" className="skip-link">Skip to content</a><ShopProvider><DiscoveryProvider><Navbar/>{children}<Footer/><ShoppingDock/><CommerceOverlays/><DiscoveryOverlays/></DiscoveryProvider></ShopProvider></body></html>;
}
