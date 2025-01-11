import { createClient } from "redis";
import Engine from "./trade/Engine";
import { BullMqAdapter } from "./infrastructure/BullMqAdapter";
import { RedisManager } from "./infrastructure/RedisManager";

async function startEngine(){
  const messagePublisher = new RedisManager();
  await messagePublisher.connect();
  const engine = new Engine(messagePublisher);
  const MessageWorker = new BullMqAdapter("messages",{
    host: 'localhost',
    port: 6379
  },engine);
}

startEngine();

// queue -> engine ->pubsub