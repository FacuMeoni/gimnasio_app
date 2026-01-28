import express from "express";
import { registerUser } from "../../controllers/userController.js";
import { tryCatch } from "../tryCatch.js";
import { registerSuperAdmin, loginSuperAdmin } from "../../controllers/superAdminController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/register-superadmin", tryCatch(registerSuperAdmin));
router.post("/login-superadmin", tryCatch(loginSuperAdmin));

export default router;
