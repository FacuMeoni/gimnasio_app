import express from "express";
import { tryCatch } from "../../utils/tryCatch.js";
import sessionController from "../controllers/sessionController.js";
import { refreshLimiter } from "../../middlewares/rateLimiters.js";
import { validateSchema } from "../../middlewares/validateMiddleware.js";
import schemas from "../../schemas/index.js";
import userController from "../controllers/userControllers.js";

const router = express.Router();

router.post("/superadmin", 
    tryCatch(validateSchema(schemas.superAdmin)), 
    tryCatch(userController.createNewUser)
);

router.post("/session", 
    tryCatch(sessionController.createSession)
);

router.post("/session/refresh", 
    tryCatch(refreshLimiter),
    tryCatch(sessionController.refreshSession)
);

router.delete("/session", 
    tryCatch(sessionController.revokeSession)
);

export default router;