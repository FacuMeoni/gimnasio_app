import express from "express";
import { registerGym } from "../controllers/gymController.js";

const router = express.Router();

router.post("/register", registerGym);

export default router;
