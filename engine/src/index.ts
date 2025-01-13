import { createClient } from "redis";
import Engine from "./trade/Engine";
import { BullMqListeningAdapter } from "./infrastructure/BullMqListeningAdapter";
import { RedisManager } from "./infrastructure/RedisManager";
import { BullMqSendingAdapter } from "./infrastructure/BullMqSendingAdapter";

async function startEngine(){
  const messagePublisher = new RedisManager();
  await messagePublisher.connect();
  const messageQueue = new BullMqSendingAdapter("db_connector",{
    host:'localhost',
    port:6380
  })
  const engine = new Engine(messagePublisher,messageQueue);
  const MessageWorker = new BullMqListeningAdapter("messages",{
    host: 'localhost',
    port: 6379
  },engine);
}

startEngine();

// queue -> engine ->pubsub