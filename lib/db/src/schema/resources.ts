import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const resourcesTable = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  platform: text("platform").notNull(),
  url: text("url").notNull(),
  type: text("type").notNull(),
  stream: text("stream").notNull(),
  language: text("language").notNull(),
  description: text("description").notNull(),
});

export type Resource = typeof resourcesTable.$inferSelect;
