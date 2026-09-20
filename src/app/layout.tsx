import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
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
const dmSans=localFont({src:[{path:"../../public/fonts/dm-sans-regular.ttf",weight:"400",style:"normal"},{path:"../../public/fonts/dm-sans-bold.ttf",weight:"700",style:"normal"}],variable:"--font-body",display:"swap"});
const barlow=localFont({src:[{path:"../../public/fonts/barlow-condensed-bold.ttf",weight:"700",style:"normal"},{path:"../../public/fonts/barlow-condensed-extrabold.ttf",weight:"800",style:"normal"}],variable:"--font-display",display:"swap"});
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {default:"V-Mart Siwan — Style in Motion",template:"%s | V-Mart Siwan"},
  description:"Siwan, meet your next look. Discover everyday fashion and standout style for men, women, kids and infants at V-Mart, Babunia More, Siwan. An interactive shopping prototype.",
  icons:{icon:"/icon.svg"},
  openGraph:{title:"V-Mart Siwan — Style in Motion",description:"Everyday fashion. Standout style. For every version of you.",images:["/images/hero-campaign.jpg"]},
};
export default function RootLayout({children}: {children:ReactNode}) {
  return <html lang="en" className={`${dmSans.variable} ${barlow.variable}`}><body><a href="#main-content" className="skip-link">Skip to content</a><ShopProvider><DiscoveryProvider><Navbar/>{children}<Footer/><ShoppingDock/><CommerceOverlays/><DiscoveryOverlays/></DiscoveryProvider></ShopProvider></body></html>;
}
