import {Request,Response} from "express";
import OrderService from "../services/orderService";

class OrderController{
    async createOrder(req:Request,res:Response):Promise<Response>{
        const data = req.body;
        const response = await OrderService.createOrder(data);
        return res.status(200).json({
            "message":"success",
        })
    }

    async deleteOrder(req:Request,res:Response){
        const {market,orderId} = req.body;
        const response = await OrderService.deleteOrder({market,orderId});
        return res.status(200).json({
            "message":"deleted successfully"
        });
    }

    async getOrders(req:Request,res:Response){
        const {userId,market} = req.query;
        const response = await OrderService.getOrders({userId,market});
        return res.status(200).json(response);
    }
}


export default new OrderController();
