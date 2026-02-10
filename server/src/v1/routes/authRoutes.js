import express from "express";
import { tryCatch } from "../../utils/tryCatch.js";
import authController from "../controllers/authController.js";
import { refreshLimiter } from "../../middlewares/rateLimiters.js";
import { validateUserSchema } from "../../middlewares/validateMiddleware.js";
import schemas from "../../schemas/userSchema.js";
import userController from "../controllers/userControllers.js";

const router = express.Router();


router.post("/superadmins", tryCatch(validateUserSchema(schemas.superAdminSchema)), tryCatch(userController.createNewUser));
router.post("/partners", tryCatch(validateUserSchema(schemas.partnerSchema)), tryCatch(userController.createNewUser));
router.post("/sessions", tryCatch(authController.createSession));
router.post("/tokens", tryCatch(refreshLimiter), tryCatch(authController.createNewTokens));
router.delete("/sessions", tryCatch(authController.revokeSession));

export default router;