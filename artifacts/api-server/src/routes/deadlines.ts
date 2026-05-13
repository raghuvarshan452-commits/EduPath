import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { examsTable } from "@workspace/db";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = auth.userId;
  next();
};

function parseDeadlineDate(str: string): Date | null {
  // Handle "Month DD, YYYY" — e.g. "June 16, 2026"
  const d = new Date(str);
  if (!isNaN(d.getTime())) return d;

  // Handle "DD Month YYYY" — e.g. "31 October 2026"
  const match = str.match(/^(\d{1,2})\s+([A-Za-z]+)\s+(\d{4})$/);
  if (match) {
    const parsed = new Date(`${match[2]} ${match[1]}, ${match[3]}`);
    if (!isNaN(parsed.getTime())) return parsed;
  }

  return null;
}

router.get("/deadlines", requireAuth, async (req: any, res) => {
  try {
    const exams = await db.select().from(examsTable);
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const upcoming = exams
      .map((exam) => {
        const date = parseDeadlineDate(exam.registrationDeadline);
        if (!date) return null;
        const msPerDay = 1000 * 60 * 60 * 24;
        const daysRemaining = Math.ceil((date.getTime() - now.getTime()) / msPerDay);
        if (daysRemaining < 0) return null;
        return {
          examId: exam.id,
          examName: exam.name,
          registrationDeadline: exam.registrationDeadline,
          daysRemaining,
          officialUrl: exam.officialUrl,
          stream: exam.stream,
        };
      })
      .filter(Boolean)
      .sort((a, b) => a!.daysRemaining - b!.daysRemaining)
      .slice(0, 3);

    res.json(upcoming);
  } catch (err) {
    req.log.error({ err }, "Failed to get upcoming deadlines");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
