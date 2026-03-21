import { Router } from "express";

import { getProfileSummary, updateMyPassword, updateMyProfile } from "../controllers/userController";
import { protect } from "../middlewares/auth";

const router = Router();

router.get("/profile", protect, getProfileSummary);
router.patch("/profile", protect, updateMyProfile);
router.patch("/password", protect, updateMyPassword);

export default router;
