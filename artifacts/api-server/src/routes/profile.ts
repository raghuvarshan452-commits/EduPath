import { Router } from "express";
import { getAuth } from "@clerk/express";
import { db } from "@workspace/db";
import { profilesTable } from "@workspace/db";
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

router.get("/profile", requireAuth, async (req: any, res) => {
  try {
    const [profile] = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkUserId, req.userId))
      .limit(1);

    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }

    res.json({
      id: profile.id,
      clerkUserId: profile.clerkUserId,
      name: profile.name,
      stream: profile.stream,
      college: profile.college,
      state: profile.state,
      category: profile.category,
      financialBackground: profile.financialBackground,
      careerInterest: profile.careerInterest,
      yearOfStudy: profile.yearOfStudy,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to get profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

router.post("/profile", requireAuth, async (req: any, res) => {
  try {
    const { name, stream, college, state, category, financialBackground, careerInterest, yearOfStudy } = req.body;

    const existing = await db
      .select()
      .from(profilesTable)
      .where(eq(profilesTable.clerkUserId, req.userId))
      .limit(1);

    let profile;
    if (existing.length > 0) {
      const [updated] = await db
        .update(profilesTable)
        .set({ name, stream, college, state, category, financialBackground, careerInterest, yearOfStudy })
        .where(eq(profilesTable.clerkUserId, req.userId))
        .returning();
      profile = updated;
    } else {
      const [created] = await db
        .insert(profilesTable)
        .values({ clerkUserId: req.userId, name, stream, college, state, category, financialBackground, careerInterest, yearOfStudy })
        .returning();
      profile = created;
    }

    res.json({
      id: profile.id,
      clerkUserId: profile.clerkUserId,
      name: profile.name,
      stream: profile.stream,
      college: profile.college,
      state: profile.state,
      category: profile.category,
      financialBackground: profile.financialBackground,
      careerInterest: profile.careerInterest,
      yearOfStudy: profile.yearOfStudy,
      createdAt: profile.createdAt.toISOString(),
      updatedAt: profile.updatedAt.toISOString(),
    });
  } catch (err) {
    req.log.error({ err }, "Failed to save profile");
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
