import express from "express";
import v1AuthRouter from "./authRoutes.js";
import v1UserRouter from "./userRoutes.js";
import v1GymRouter from "./gymRoutes.js";
import v1PlanRouter from "./planRoutes.js";

const router = express.Router();


router.use("/plans", v1PlanRouter);
router.use("/auth", v1AuthRouter);
router.use("/users", v1UserRouter);
router.use("/gyms", v1GymRouter);

export default router;
