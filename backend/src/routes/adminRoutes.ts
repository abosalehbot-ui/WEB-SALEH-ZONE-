import { Router } from "express";

import {
  createCategory,
  deleteCategory,
  getAdminOverview,
  listCategories,
  listOrders,
  listProducts,
  listUsers,
  updateCategory
} from "../controllers/adminController";
import { protect, restrictTo } from "../middlewares/auth";

const router = Router();

router.use(protect, restrictTo("SuperAdmin"));
router.get("/overview", getAdminOverview);
router.get("/categories", listCategories);
router.post("/categories", createCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.get("/products", listProducts);
router.get("/orders", listOrders);
router.get("/users", listUsers);

export default router;
