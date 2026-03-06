import { NextFunction, Request, Response } from "express";

import { AppError } from "../middlewares/errorHandler";
import { Category } from "../models/Category";
import { Product } from "../models/Product";

export const getCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ createdAt: -1 });
    res.status(200).json({ categories });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to fetch categories", 500));
  }
};

export const getCategoryBySlug = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });

    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    const products = await Product.find({ category: category._id, isActive: true })
      .populate("offers.merchant", "fullName username")
      .sort({ createdAt: -1 });

    res.status(200).json({ category, products });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to fetch category", 500));
  }
};

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category } = req.query as { category?: string };
    const query: Record<string, unknown> = { isActive: true };

    if (category) {
      query.category = category;
    }

    const products = await Product.find(query)
      .populate("category", "name slug")
      .populate("offers.merchant", "fullName username")
      .sort({ createdAt: -1 });

    res.status(200).json({ products });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to fetch products", 500));
  }
};

export const getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name slug")
      .populate("offers.merchant", "fullName username");

    if (!product || !product.isActive) {
      return next(new AppError("Product not found", 404));
    }

    res.status(200).json({ product });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to fetch product", 500));
  }
};
