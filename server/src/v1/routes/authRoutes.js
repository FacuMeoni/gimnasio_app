import express from "express";
import { tryCatch } from "../../utils/tryCatch.js";
import { registerSuperAdmin, login, generateNewTokens, registerUser, logout } from "../controllers/authController.js";
import { refreshLimiter } from "../../middlewares/rateLimiters.js";
import { validateUserSchema } from "../../middlewares/validateMiddleware.js";
import { superAdminSchema, userSchema } from "../../schemas/authSchema.js";

const router = express.Router();


router.post("/register-superadmin", tryCatch(validateUserSchema(superAdminSchema)), tryCatch(registerSuperAdmin));
router.post("/login", tryCatch(login));
router.post("/register-user", tryCatch(validateUserSchema(userSchema)), tryCatch(registerUser));
router.post("/refresh-tokens", tryCatch(refreshLimiter), tryCatch(generateNewTokens));
router.post("/logout", tryCatch(logout));

export default router;