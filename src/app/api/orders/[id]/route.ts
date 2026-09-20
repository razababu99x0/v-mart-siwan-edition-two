import { db } from "@/db";
import { orders } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { errorResponse, getSessionId } from "@/lib/server-store";
export async function GET(_request:Request,{params}:{params:Promise<{id:string}>}) {
  try { const {id}=await params;const sessionId=await getSessionId();const [order]=await db.select().from(orders).where(and(eq(orders.id,id),eq(orders.sessionId,sessionId)));if(!order)return Response.json({error:"This order wasn't found in your shopping session."},{status:404});return Response.json({orderId:order.id,total:order.total,items:order.items,name:order.customer.name,delivery:order.customer.delivery,createdAt:order.createdAt,prototype:true}); }
  catch(error){return errorResponse(error);}
}
