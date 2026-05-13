import { pgTable, text, serial } from "drizzle-orm/pg-core";

export const examsTable = pgTable("exams", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  conductedBy: text("conducted_by").notNull(),
  examDate: text("exam_date").notNull(),
  registrationDeadline: text("registration_deadline").notNull(),
  officialUrl: text("official_url").notNull(),
  stream: text("stream").notNull(),
  description: text("description").notNull(),
  careerRelevance: text("career_relevance").notNull(),
});

export type Exam = typeof examsTable.$inferSelect;
