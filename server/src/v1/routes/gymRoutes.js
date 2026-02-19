import { Router } from "express";
import gymController from "../controllers/GymController.js";
import { tryCatch } from "../../utils/tryCatch.js";
import schemas from "../../schemas/index.js";
import { validateSchema, validatePartialSchema } from "../../middlewares/validateMiddleware.js";
import { authenticate, authorize } from "../../middlewares/authMiddlewares.js";

const router = Router();

router.post("/", tryCatch(validateSchema(schemas.onBoarding)), tryCatch(gymController.setupGymAndAdmin));
router.get("/:slug", tryCatch(authenticate), tryCatch(gymController.getGymBySlug));
router.patch("/", tryCatch(authenticate), tryCatch(authorize("admin")), tryCatch(validatePartialSchema(schemas.gym)), tryCatch(gymController.editGym));

export default router;