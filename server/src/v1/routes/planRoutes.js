import { Router } from "express";
import planController from "../controllers/planController.js";
import { tryCatch } from "../../utils/tryCatch.js";
import { authenticate, authorize } from "../../middlewares/authMiddlewares.js";
import { validateSchema, validatePartialSchema } from "../../middlewares/validateMiddleware.js";
import schemas from "../../schemas/index.js";

const router = Router();

router.post("/", 
    tryCatch(authenticate), 
    tryCatch(authorize("superadmin", "admin", "employee")), 
    tryCatch(validateSchema(schemas.plan)), 
    tryCatch(planController.createPlan)
);

router.get("/", 
    tryCatch(authenticate), 
    tryCatch(authorize("superadmin", "admin", "employee", "partner")), 
    tryCatch(planController.getPlansByGym)
);

router.get("/:id", 
    tryCatch(authenticate), 
    tryCatch(authorize("superadmin", "admin", "employee", "partner")), 
    tryCatch(planController.getPlanById)
);

router.delete("/:id", 
    tryCatch(authenticate), 
    tryCatch(authorize("superadmin", "admin", "employee")), 
    tryCatch(planController.deletePlan)
);

router.patch("/:id", 
    tryCatch(authenticate), 
    tryCatch(authorize("superadmin", "admin", "employee")), 
    tryCatch(validatePartialSchema(schemas.plan)), 
    tryCatch(planController.patchPlan)
);

export default router;