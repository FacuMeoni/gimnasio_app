import express from "express";
import gymRoutes from "./gymRoutes.js";
import userRoutes from "./userRoutes.js";

const router = express.Router();

router.use("/gym", gymRoutes);
router.use("/user", userRoutes);

export default router;
