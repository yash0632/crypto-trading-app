import { RedisManager } from "../infrastructure/redis/redisManager";

class OrderService {
  async createOrder(data: any) {
    const { market, price, quantity, side, userId } = data;

    const response = await RedisManager.getInstance().sendAndAwait({
      type: "CREATE_ORDER",
      data: {
        market,
        price,
        quantity,
        side,
        userId,
      },
    });
    return response;
  }

  async deleteOrder(data: any) {
    const { market, orderId } = data;
    const response = await RedisManager.getInstance().sendAndAwait({
      type: "DELETE_ORDER",
      data: {
        market,
        orderId,
      },
    });

    return response;
  }

  async getOrders(data: any) {
    const response = await RedisManager.getInstance().sendAndAwait({
      type: "GET_OPEN_ORDERS",
      data: {
        userId: data.userId,
        market: data.market,
      },
    });
    return response;
  }
}

export default new OrderService();
