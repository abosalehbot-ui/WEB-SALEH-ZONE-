import { Router } from "express";

import { getProfileSummary } from "../controllers/userController";
import { protect } from "../middlewares/auth";

const router = Router();

router.get("/profile", protect, getProfileSummary);

export default router;
