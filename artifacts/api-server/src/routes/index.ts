import { Router, type IRouter } from "express";
import healthRouter from "./health";
import profileRouter from "./profile";
import scholarshipsRouter from "./scholarships";
import examsRouter from "./exams";
import resourcesRouter from "./resources";
import mentorsRouter from "./mentors";
import dashboardRouter from "./dashboard";
import deadlinesRouter from "./deadlines";
import savedScholarshipsRouter from "./savedScholarships";

const router: IRouter = Router();

router.use(healthRouter);
router.use(profileRouter);
router.use(scholarshipsRouter);
router.use(examsRouter);
router.use(resourcesRouter);
router.use(mentorsRouter);
router.use(dashboardRouter);
router.use(deadlinesRouter);
router.use(savedScholarshipsRouter);

export default router;
