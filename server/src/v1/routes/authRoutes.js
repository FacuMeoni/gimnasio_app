import express from "express";
import { tryCatch } from "../../utils/tryCatch.js";
import authController from "../controllers/authController.js";
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
    tryCatch(authController.createSession)
);

router.post("/session/tokens", 
    tryCatch(refreshLimiter),
    tryCatch(authController.createNewTokens)
);

router.delete("/session", 
    tryCatch(authController.revokeSession)
);

export default router;