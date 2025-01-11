import {Router,Request,Response} from 'express';
import OrderController from '../controllers/orderControllers';

const orderRouter = Router();

orderRouter.post("/",(req:Request,res:Response) =>{
    OrderController.createOrder(req,res)
});

orderRouter.delete("/",(req:Request,res:Response)=>{
    OrderController.cancelOrder(req,res)

})

orderRouter.get("/open",(req:Request,res:Response) => {
    OrderController.getOrders(req,res)
})

export default orderRouter;