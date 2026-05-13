import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { profilesTable, scholarshipsTable, examsTable, resourcesTable, mentorsTable } from "@workspace/db";
import { eq, count } from "drizzle-orm";

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

router.get("/dashboard/summary", requireAuth, async (req: any, res) => {
  try {
    const [profile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkUserId, req.userId))
      .limit(1);

    const [scholarshipsResult] = await db.select({ count: count() }).from(scholarshipsTable);
    const [examsResult] = await db.select({ count: count() }).from(examsTable);
    const [resourcesResult] = await db.select({ count: count() }).from(resourcesTable);
    const [mentorsResult] = await db.select({ count: count() }).from(mentorsTable);

    res.json({
      scholarshipsCount: Number(scholarshipsResult?.count ?? 0),
      examsCount: Number(examsResult?.count ?? 0),
      resourcesCount: Number(resourcesResult?.count ?? 0),
      mentorsCount: Number(mentorsResult?.count ?? 0),
      hasProfile: !!profile,
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get dashboard summary");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
