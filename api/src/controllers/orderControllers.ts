import {Request,Response} from "express";
import OrderService from "../services/orderService";

class OrderController{
    async createOrder(req:Request,res:Response){
        const data = req.body;
        await OrderService.createOrder(data);
    }
}


export default new OrderController();
