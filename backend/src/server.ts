import "dotenv/config";

import app from "./app";
import { connectToDatabase } from "./config/db";

const port = Number(process.env.PORT) || 8080;
const host = "0.0.0.0";

const startServer = async (): Promise<void> => {
  await connectToDatabase();

  app.listen(port, host, () => {
    console.log(`Saleh Zone backend listening on http://${host}:${port}`);
  });
};

void startServer();
