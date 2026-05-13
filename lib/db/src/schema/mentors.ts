import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const mentorsTable = pgTable("mentors", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  title: text("title").notNull(),
  college: text("college").notNull(),
  careerDomain: text("career_domain").notNull(),
  background: text("background").notNull(),
  contactUrl: text("contact_url").notNull(),
  availability: text("availability").notNull(),
  bio: text("bio").notNull(),
});

export type Mentor = typeof mentorsTable.$inferSelect;
