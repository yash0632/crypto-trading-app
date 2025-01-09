import {Router} from 'express';
import OrderController from '../controllers/orderControllers';

export const orderRouter = Router();

orderRouter.post("/",OrderController.createOrder);
