import { Router } from "express";

import {
  createCategory,
  createProduct,
  deleteCategory,
  deleteProduct,
  getAdminOverview,
  listCategories,
  listOrders,
  listProducts,
  listUsers,
  updateCategory,
  updateProduct
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
router.post("/products", createProduct);
router.patch("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);
router.get("/orders", listOrders);
router.get("/users", listUsers);

export default router;
