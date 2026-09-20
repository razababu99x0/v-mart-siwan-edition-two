import { HomePage } from "@/components/home-page";
import { getProducts } from "@/lib/server-store";
export const dynamic = "force-dynamic";
export default async function Page() {
  const products = await getProducts();
  return <HomePage initialProducts={products}/>;
}
