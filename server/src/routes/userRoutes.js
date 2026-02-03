import express from "express";
import { tryCatch } from "../utils/tryCatch.js";
import { registerSuperAdmin, loginSuperAdmin } from "../controllers/superAdminController.js";
import { registerAdmin } from "../controllers/adminController.js";
import { generateNewTokens } from "../controllers/refreshTokenController.js";
import { authenticateUser, checkUserRole } from "../middlewares/authMiddlewares.js";

const router = express.Router();


router.post("/register-superadmin", tryCatch(registerSuperAdmin));
router.post("/login-superadmin", tryCatch(loginSuperAdmin));
router.get("/refresh-tokens", tryCatch(generateNewTokens));
router.use(tryCatch(authenticateUser));
router.post("/register-admin", checkUserRole("superadmin"), tryCatch(registerAdmin));

export default router;
