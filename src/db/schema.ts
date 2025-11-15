import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export * from "@/../auth-schema";

export const branch = pgTable("branch", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: text("title").notNull(),
  address: text("address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updateAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
});

export type TDBBranch = typeof branch.$inferSelect;
