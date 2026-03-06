import cors, { CorsOptions } from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import helmet from "helmet";

import { globalErrorHandler, notFoundHandler } from "./middlewares/errorHandler";
import authRoutes from "./routes/authRoutes";
import walletRoutes from "./routes/walletRoutes";
import orderRoutes from "./routes/orderRoutes";

const app: Application = express();

const allowedOrigin = process.env.FRONTEND_URL;

const corsOptions: CorsOptions = {
  origin: (origin, callback) => {
    if (!allowedOrigin || !origin || origin === allowedOrigin) {
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

app.use(notFoundHandler);
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  globalErrorHandler(err, req, res, next);
});

export default app;
