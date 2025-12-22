import { integer, jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export * from "@/../auth-schema";

type Timing = {
  from: string;
  to: string;
};

export const branch = pgTable("branch", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: text("title").notNull(),
  address: text("address"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updateAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
});

export const batch = pgTable("batch", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  branchId: integer("branch_id").references(() => branch.id, {
    onDelete: "set null",
  }),
  title: text("title").notNull(),
  day: text("day").notNull(),
  timing: jsonb().$type<Timing>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
});

export const standard = pgTable("standard", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  title: text("title").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
});

export const student = pgTable("student", {
  id: integer("id").primaryKey().generatedByDefaultAsIdentity(),
  name: text("name").notNull(),
  guardian: text("guardian").notNull(),
  address: text("address").notNull(),
  phone: text("phone").notNull(),
  standardId: integer("standard_id").references(() => standard.id, {
    onDelete: "set null",
  }),
  branchId: integer("branch_id").references(() => branch.id, {
    onDelete: "set null",
  }),
  batchId: integer("batch_id").references(() => batch.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at"),
  deletedAt: timestamp("deleted_at"),
});

export type TDBBranch = typeof branch.$inferSelect;
