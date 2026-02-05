import { Router } from "express";
import { registerAdmin } from "../controllers/userController.js";
import { tryCatch } from "../utils/tryCatch.js";
import { authenticateUser, checkUserRole } from "../middlewares/authMiddlewares.js";
import { validateSchema } from "../middlewares/validateMiddleware.js";
import { adminSchema } from "../schemas/authSchema.js";

const router = Router();

router.post("/register-admin", tryCatch(validateSchema(adminSchema)), tryCatch(authenticateUser), tryCatch(checkUserRole("superadmin", "admin")), tryCatch(registerAdmin));

export default router;