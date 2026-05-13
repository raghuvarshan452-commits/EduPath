import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { examsTable, profilesTable } from "@workspace/db";
import { eq, or } from "drizzle-orm";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  const userId = auth?.userId;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  req.userId = userId;
  next();
};

router.get("/exams", requireAuth, async (req: any, res) => {
  try {
    const [profile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkUserId, req.userId))
      .limit(1);

    let exams;
    if (profile) {
      exams = await db
        .select()
        .from(examsTable)
        .where(
          or(
            eq(examsTable.stream, profile.stream),
            eq(examsTable.stream, "all"),
          )
        )
        .limit(20);
    } else {
      exams = await db.select().from(examsTable).limit(20);
    }

    res.json(exams);
  } catch (err) {
    req.log.error({ err }, "Failed to get exams");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
