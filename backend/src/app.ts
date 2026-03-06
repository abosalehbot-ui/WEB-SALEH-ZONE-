import cors, { CorsOptions } from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";

import { globalErrorHandler, notFoundHandler } from "./middlewares/errorHandler";
import adminRoutes from "./routes/adminRoutes";
import authRoutes from "./routes/authRoutes";
import catalogRoutes from "./routes/catalogRoutes";
import merchantRoutes from "./routes/merchantRoutes";
import orderRoutes from "./routes/orderRoutes";
import supportRoutes from "./routes/supportRoutes";
import userRoutes from "./routes/userRoutes";
import walletRoutes from "./routes/walletRoutes";

const app: Application = express();

const parseAllowedOrigins = (): string[] => {
  const explicitOrigins = process.env.FRONTEND_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) || [];

  if (explicitOrigins.length > 0) {
    return explicitOrigins;
  }

  if (process.env.FRONTEND_URL) {
    return [process.env.FRONTEND_URL];
  }

  return [];
};

const allowedOrigins = parseAllowedOrigins();

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("CORS policy violation"));
  },
  credentials: true
};

app.use(helmet());
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/healthz", (_req: Request, res: Response) => {
  res.status(200).json({ status: "ok" });
});

app.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Saleh Zone backend is running" });
});

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/merchant", merchantRoutes);
app.use("/api/user", userRoutes);
app.use("/api/support", supportRoutes);

app.use(notFoundHandler);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  globalErrorHandler(err, req, res, next);
});

export default app;
