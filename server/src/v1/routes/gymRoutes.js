import { Router } from "express";
import gymController from "../controllers/GymController.js";
import { tryCatch } from "../../utils/tryCatch.js";
import schemas from "../../schemas/gymSchema.js";
import { validateSchema } from "../../middlewares/validateMiddleware.js";
import { authenticate } from "../../middlewares/authMiddlewares.js";

const router = Router();

router.post("/", tryCatch(validateSchema(schemas.onBoardingSchema)), tryCatch(gymController.setupGymAndAdmin));
router.get("/:slug", tryCatch(authenticate), tryCatch(gymController.getGymBySlug));

export default router;