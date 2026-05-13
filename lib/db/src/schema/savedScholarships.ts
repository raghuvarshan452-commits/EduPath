import { pgTable, text, serial, integer, timestamp, unique } from "drizzle-orm/pg-core";

export const savedScholarshipsTable = pgTable("saved_scholarships", {
  id: serial("id").primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  scholarshipId: integer("scholarship_id").notNull(),
  savedAt: timestamp("saved_at").defaultNow().notNull(),
}, (t) => [unique().on(t.clerkUserId, t.scholarshipId)]);

export type SavedScholarship = typeof savedScholarshipsTable.$inferSelect;
