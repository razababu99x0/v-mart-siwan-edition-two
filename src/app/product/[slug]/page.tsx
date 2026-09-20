import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProduct, getProducts } from "@/lib/server-store";
import { ProductDetail } from "@/components/product-detail";
export const dynamic = "force-dynamic";
type Props = {params:Promise<{slug:string}>};
export async function generateMetadata({params}:Props):Promise<Metadata>{const {slug}=await params;const product=await getProduct(slug);return {title:product?.name??"Style not found",description:product?.description};}
export default async function ProductPage({params}:Props){const {slug}=await params;const product=await getProduct(slug);if(!product)notFound();const all=await getProducts();const related=all.filter(p=>p.id!==product.id).sort((a,b)=>Number(b.category===product.category)-Number(a.category===product.category)).slice(0,4);return <ProductDetail initialProduct={product} related={related}/>;}
