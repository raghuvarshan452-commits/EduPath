import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { mentorsTable, profilesTable } from "@workspace/db";
import { eq } from "drizzle-orm";

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

router.get("/mentors", requireAuth, async (req: any, res) => {
  try {
    const [profile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkUserId, req.userId))
      .limit(1);

    let mentors;
    if (profile) {
      mentors = await db
        .select()
        .from(mentorsTable)
        .where(eq(mentorsTable.careerDomain, profile.careerInterest))
        .limit(10);

      if (mentors.length < 3) {
        mentors = await db.select().from(mentorsTable).limit(10);
      }
    } else {
      mentors = await db.select().from(mentorsTable).limit(10);
    }

    res.json(mentors);
  } catch (err) {
    req.log.error({ err }, "Failed to get mentors");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
