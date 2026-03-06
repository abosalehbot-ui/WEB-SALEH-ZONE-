import { Router } from "express";

import { checkoutCart } from "../controllers/orderController";
import { protect } from "../middlewares/auth";

const router = Router();

router.post("/checkout", protect, checkoutCart);

export default router;
