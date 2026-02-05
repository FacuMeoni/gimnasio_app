import { Router } from "express";
import { registerAdmin } from "../controllers/userController.js";
import { tryCatch } from "../utils/tryCatch.js";
import { authenticateUser, checkUserRole } from "../middlewares/authMiddlewares.js";

const router = Router();

router.post("/register-admin", tryCatch(authenticateUser), tryCatch(checkUserRole("superadmin", "admin")), tryCatch(registerAdmin));

export default router;