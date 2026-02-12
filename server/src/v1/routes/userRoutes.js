import { Router } from "express";
import userController from "../controllers/userControllers.js";
import { tryCatch } from "../../utils/tryCatch.js";
import { authenticate, authorize } from "../../middlewares/authMiddlewares.js";
import { validateSchema } from "../../middlewares/validateMiddleware.js";
import schemas from "../../schemas/userSchema.js";

const router = Router();

router.post("/staff", tryCatch(validateSchema(schemas.staffSchema)), tryCatch(authenticate), tryCatch(authorize("superadmin", "admin")), tryCatch(userController.createNewUser));
router.get("/partners", tryCatch(authenticate), tryCatch(authorize("superadmin", "admin", "employee")), tryCatch(userController.getAllPartnersByGym));
router.post("/partners", tryCatch(authenticate), tryCatch(authorize("superadmin", "admin", "employee")), tryCatch(validateSchema(schemas.partnerSchema)), tryCatch(userController.createPartnerWithProfile));

export default router;