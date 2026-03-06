import { Router } from "express";

import { checkoutCart, getManualOrders, getMyOrders } from "../controllers/orderController";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

router.post("/checkout", protect, checkoutCart);
router.get("/my", protect, getMyOrders);
router.get("/manual", protect, restrictTo("Employee", "SuperAdmin"), getManualOrders);

export default router;
