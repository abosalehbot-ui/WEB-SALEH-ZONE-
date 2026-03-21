import { NextFunction, Request, Response } from "express";

import { AppError } from "../middlewares/errorHandler";
import { Category } from "../models/Category";
import { Order } from "../models/Order";
import { Product } from "../models/Product";
import { User } from "../models/User";

const slugify = (input: string) =>
  input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-");

export const getAdminOverview = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const [totalRevenueResult, activeUsers, pendingOrders, activeMerchants] = await Promise.all([
      Order.aggregate([{ $group: { _id: null, total: { $sum: "$totalAmount" } } }]),
      User.countDocuments({ role: "Customer" }),
      Order.countDocuments({ fulfillmentStatus: { $in: ["Pending", "Manual_Action_Required"] } }),
      User.countDocuments({ role: "Merchant" })
    ]);

    res.status(200).json({
      totalRevenue: totalRevenueResult[0]?.total ?? 0,
      activeUsers,
      pendingOrders,
      activeMerchants
    });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to load dashboard", 500));
  }
};

export const listCategories = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json({ categories });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to load categories", 500));
  }
};

export const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, image } = req.body as { name?: string; description?: string; image?: string };

    if (!name) {
      return next(new AppError("name is required", 400));
    }

    const slug = slugify(name);
    const exists = await Category.findOne({ slug });
    if (exists) {
      return next(new AppError("Category already exists", 409));
    }

    const category = await Category.create({ name, description, image, slug, isActive: true });
    res.status(201).json({ category });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to create category", 500));
  }
};

export const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, description, image, isActive } = req.body as {
      name?: string;
      description?: string;
      image?: string;
      isActive?: boolean;
    };

    const category = await Category.findById(req.params.id);
    if (!category) {
      return next(new AppError("Category not found", 404));
    }

    if (name) {
      category.name = name;
      category.slug = slugify(name);
    }

    if (description !== undefined) category.description = description;
    if (image !== undefined) category.image = image;
    if (isActive !== undefined) category.isActive = isActive;

    await category.save();
    res.status(200).json({ category });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to update category", 500));
  }
};

export const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Category.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Category deleted" });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to delete category", 500));
  }
};

export const listProducts = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const products = await Product.find().populate("category", "name").sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to load products", 500));
  }
};



export const createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, slug, category, productType, basePrice, image, description } = req.body as any;
    if (!name || !slug || !category || !productType) return next(new AppError("name, slug, category, productType are required", 400));

    const product = await Product.create({
      name,
      slug,
      category,
      productType,
      basePrice: Number(basePrice || 0),
      image,
      description,
      offers: []
    });

    res.status(201).json({ product });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to create product", 500));
  }
};

export const updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!product) return next(new AppError("Product not found", 404));
    res.status(200).json({ product });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to update product", 500));
  }
};

export const deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to delete product", 500));
  }
};
export const listOrders = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const orders = await Order.find()
      .populate("customer", "fullName username email")
      .populate("items.product", "name")
      .sort({ createdAt: -1 })
      .limit(100);
    res.status(200).json({ orders });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to load orders", 500));
  }
};

export const listUsers = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const users = await User.find().select("fullName username email role walletBalance createdAt").sort({ createdAt: -1 });
    res.status(200).json({ users });
  } catch (error) {
    return next(new AppError(error instanceof Error ? error.message : "Failed to load users", 500));
  }
};
