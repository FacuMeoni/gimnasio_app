import { Router } from "express";
import userController from "../controllers/userControllers.js";
import { tryCatch } from "../../utils/tryCatch.js";
import { authenticate, authorize } from "../../middlewares/authMiddlewares.js";
import { validateUserSchema } from "../../middlewares/validateMiddleware.js";
import schemas from "../../schemas/userSchema.js";

const router = Router();

router.post("/staff", tryCatch(validateUserSchema(schemas.staffSchema)), tryCatch(authenticate), tryCatch(authorize("superadmin", "admin")), tryCatch(userController.createNewUser));


export default router;