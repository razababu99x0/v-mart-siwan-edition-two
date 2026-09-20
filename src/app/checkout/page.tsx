import type { Metadata } from "next";
import { Checkout } from "@/components/checkout";
export const dynamic="force-dynamic";
export const metadata:Metadata={title:"Your next look — Guest checkout",robots:{index:false,follow:false}};
export default function CheckoutPage(){return <Checkout/>;}
