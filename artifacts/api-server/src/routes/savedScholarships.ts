import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { savedScholarshipsTable, scholarshipsTable } from "@workspace/db";
import { eq, and, inArray } from "drizzle-orm";

const router = Router();

const requireAuth = (req: any, res: any, next: any) => {
  const auth = getAuth(req);
  if (!auth?.userId) return res.status(401).json({ error: "Unauthorized" });
  req.userId = auth.userId;
  next();
};

router.get("/scholarships/saved", requireAuth, async (req: any, res) => {
  try {
    const saved = await db
      .select()
      .from(savedScholarshipsTable)
      .where(eq(savedScholarshipsTable.clerkUserId, req.userId));

    if (saved.length === 0) return res.json([]);

    const ids = saved.map((s) => s.scholarshipId);
    const scholarships = await db
      .select()
      .from(scholarshipsTable)
      .where(inArray(scholarshipsTable.id, ids));

    res.json(scholarships);
  } catch (err) {
    req.log.error({ err }, "Failed to get saved scholarships");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/scholarships/saved/ids", requireAuth, async (req: any, res) => {
  try {
    const saved = await db
      .select({ scholarshipId: savedScholarshipsTable.scholarshipId })
      .from(savedScholarshipsTable)
      .where(eq(savedScholarshipsTable.clerkUserId, req.userId));

    res.json(saved.map((s) => s.scholarshipId));
  } catch (err) {
    req.log.error({ err }, "Failed to get saved scholarship IDs");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/scholarships/:id/save", requireAuth, async (req: any, res) => {
  try {
    const scholarshipId = parseInt(req.params.id, 10);
    if (isNaN(scholarshipId)) return res.status(400).json({ error: "Invalid ID" });

    await db
      .insert(savedScholarshipsTable)
      .values({ clerkUserId: req.userId, scholarshipId })
      .onConflictDoNothing();

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to save scholarship");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.delete("/scholarships/:id/save", requireAuth, async (req: any, res) => {
  try {
    const scholarshipId = parseInt(req.params.id, 10);
    if (isNaN(scholarshipId)) return res.status(400).json({ error: "Invalid ID" });

    await db
      .delete(savedScholarshipsTable)
      .where(
        and(
          eq(savedScholarshipsTable.clerkUserId, req.userId),
          eq(savedScholarshipsTable.scholarshipId, scholarshipId),
        )
      );

    res.json({ ok: true });
  } catch (err) {
    req.log.error({ err }, "Failed to unsave scholarship");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
