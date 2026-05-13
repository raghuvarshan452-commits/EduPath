import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const scholarshipsTable = pgTable("scholarships", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  provider: text("provider").notNull(),
  amount: text("amount").notNull(),
  deadline: text("deadline").notNull(),
  applyUrl: text("apply_url").notNull(),
  eligibility: text("eligibility").notNull(),
  category: text("category").notNull(),
  state: text("state"),
  stream: text("stream").notNull().default("all"),
  description: text("description").notNull(),
});

export type Scholarship = typeof scholarshipsTable.$inferSelect;
