import "dotenv/config";

import http from "http";

import app from "./app";
import { connectToDatabase } from "./config/db";
import { initChatSocket } from "./websockets/chatSocket";

const port = Number(process.env.PORT) || 8080;
const host = "0.0.0.0";

const startServer = async (): Promise<void> => {
  await connectToDatabase();

  const httpServer = http.createServer(app);
  initChatSocket(httpServer);

  httpServer.listen(port, host, () => {
    console.log(`Saleh Zone backend listening on http://${host}:${port}`);
  });
};

void startServer();
