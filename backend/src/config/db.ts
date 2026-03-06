import mongoose from "mongoose";

let listenersRegistered = false;

const registerConnectionListeners = (): void => {
  if (listenersRegistered) {
    return;
  }

  mongoose.connection.on("connected", () => {
    console.log("MongoDB connected");
  });

  mongoose.connection.on("error", (error: Error) => {
    console.error("MongoDB connection error:", error.message);
  });

  mongoose.connection.on("disconnected", () => {
    console.warn("MongoDB disconnected");
  });

  listenersRegistered = true;
};

export const connectToDatabase = async (): Promise<void> => {
  const mongoUri = process.env.MONGO_URI;

  if (!mongoUri) {
    console.error("MONGO_URI is not defined");
    process.exit(1);
  }

  registerConnectionListeners();

  try {
    await mongoose.connect(mongoUri);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown MongoDB connection error";
    console.error(`Failed to connect to MongoDB: ${message}`);
    process.exit(1);
  }
};

export const disconnectFromDatabase = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
};
