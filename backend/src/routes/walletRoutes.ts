import { Router } from "express";

import { depositFunds, getWalletInfo } from "../controllers/walletController";
import { protect } from "../middlewares/auth";

const router = Router();

router.use(protect);
router.get("/info", getWalletInfo);
router.post("/deposit", depositFunds);

export default router;
