import { Router } from "express";

import { forgotPassword, login, logout, me, register } from "../controllers/authController";
import { protect } from "../middlewares/auth";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.get("/me", protect, me);

export default router;
