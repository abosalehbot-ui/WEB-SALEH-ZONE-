import { Router } from "express";

import { getMerchantOverview, getMerchantProducts } from "../controllers/merchantController";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

router.use(protect, restrictTo("Merchant", "SuperAdmin"));
router.get("/overview", getMerchantOverview);
router.get("/products", getMerchantProducts);

export default router;
