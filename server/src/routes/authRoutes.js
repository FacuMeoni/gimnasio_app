import express from "express";
import { tryCatch } from "../utils/tryCatch.js";
import { registerSuperAdmin, login, generateNewTokens } from "../controllers/authController.js";
import { refreshLimiter } from "../middlewares/rateLimiters.js";

const router = express.Router();


router.post("/register-superadmin", tryCatch(registerSuperAdmin));
router.post("/login", tryCatch(login));
router.post("/refresh-tokens", tryCatch(refreshLimiter), tryCatch(generateNewTokens));

export default router;