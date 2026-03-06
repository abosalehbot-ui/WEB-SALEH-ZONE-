import { Router } from "express";

import { getCategories, getCategoryBySlug, getProductById, getProducts } from "../controllers/catalogController";

const router = Router();

router.get("/categories", getCategories);
router.get("/categories/:slug", getCategoryBySlug);
router.get("/products", getProducts);
router.get("/products/:id", getProductById);

export default router;
