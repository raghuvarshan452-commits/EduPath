import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { resourcesTable, profilesTable } from "@workspace/db";
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

router.get("/resources", requireAuth, async (req: any, res) => {
  try {
    const [profile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkUserId, req.userId))
      .limit(1);

    let resources;
    if (profile) {
      resources = await db
        .select()
        .from(resourcesTable)
        .where(
          or(
            eq(resourcesTable.stream, profile.stream),
            eq(resourcesTable.stream, "all"),
          )
        )
        .limit(20);
    } else {
      resources = await db.select().from(resourcesTable).limit(20);
    }

    res.json(resources);
  } catch (err) {
    req.log.error({ err }, "Failed to get resources");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
