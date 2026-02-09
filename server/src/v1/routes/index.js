import express from "express";
import v1AuthRouter from "./authRoutes.js";
import v1UserRouter from "./userRoutes.js";

const router = express.Router();

router.use("/auth", v1AuthRouter);
router.use("/users", v1UserRouter);

export default router;
