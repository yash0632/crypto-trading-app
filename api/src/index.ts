import express, { Application } from "express";
import cors from "cors";
import orderRouter from "./routes/orderRoutes";
import { RedisManager } from "./infrastructure/redis/redisManager";
import { BullMqAdapter } from "./infrastructure/queue/BullMqAdapter";

const app: Application = express();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: "GET,POST,DELETE,UPDATE,PUT,PATCH",
  })
);

app.use(express.json());

async function startServer() {
  try {
    const queueAdapter = new BullMqAdapter("messages",{
      host: 'localhost',
      port: 6379
    })
    await RedisManager.initialize(queueAdapter);

    app.use("/api/v1/order", orderRouter);

    app.listen(3000, () => {
      console.log(`Server is running on port 3000`);
    });
  } catch (e) {
    console.error("Error Starting the server:", e);
    process.exit(1);
  }
}

startServer();
