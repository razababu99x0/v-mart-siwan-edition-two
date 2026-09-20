import { pgTable, text, jsonb, integer, timestamp } from "drizzle-orm/pg-core";
import type { Product, CartLine, Customer } from "@/lib/types";
import type { StylePreferences } from "@/lib/discovery";

export const products = pgTable("products", {
  id: text("id").primaryKey(),
  data: jsonb("data").$type<Product>().notNull(),
});
export const shoppingSessions = pgTable("shopping_sessions", {
  id: text("id").primaryKey(),
  cart: jsonb("cart").$type<CartLine[]>().notNull().default([]),
  wishlist: jsonb("wishlist").$type<string[]>().notNull().default([]),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
export const orders = pgTable("orders", {
  id: text("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  customer: jsonb("customer").$type<Customer>().notNull(),
  items: jsonb("items").$type<(CartLine & { name: string; price: number })[]>().notNull(),
  total: integer("total").notNull(),
  paymentMethod: text("payment_method").notNull(),
  status: text("status").notNull().default("prototype-confirmed"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const subscribers = pgTable("subscribers", {
  email: text("email").primaryKey(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
export const styleProfiles = pgTable("style_profiles", {
  sessionId: text("session_id").primaryKey().references(() => shoppingSessions.id, { onDelete: "cascade" }),
  preferences: jsonb("preferences").$type<StylePreferences>().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
