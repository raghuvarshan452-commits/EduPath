import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { scholarshipsTable, profilesTable } from "@workspace/db";
import { eq, or, isNull, and } from "drizzle-orm";

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

router.get("/scholarships", requireAuth, async (req: any, res) => {
  try {
    const [profile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkUserId, req.userId))
      .limit(1);

    let scholarships;
    if (profile) {
      scholarships = await db
        .select()
        .from(scholarshipsTable)
        .where(
          and(
            or(
              eq(scholarshipsTable.category, profile.category),
              eq(scholarshipsTable.category, "all"),
            ),
            or(
              isNull(scholarshipsTable.state),
              eq(scholarshipsTable.state, profile.state),
            ),
          )
        )
        .limit(20);
    } else {
      scholarships = await db.select().from(scholarshipsTable).limit(20);
    }

    res.json(scholarships.map(s => ({
      id: s.id,
      name: s.name,
      provider: s.provider,
      amount: s.amount,
      deadline: s.deadline,
      applyUrl: s.applyUrl,
      eligibility: s.eligibility,
      category: s.category,
      state: s.state ?? null,
      description: s.description,
    })));
  } catch (err) {
    req.log.error({ err }, "Failed to get scholarships");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
