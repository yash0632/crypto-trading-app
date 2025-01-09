import express,{Application} from 'express';
import cors from 'cors';
import { orderRouter } from './routes/orderRoutes';

const app:Application = express();

app.use(cors({
    origin:["http://localhost:5173"],
    methods:"GET,POST,DELETE,UPDATE,PUT,PATCH",
}))

app.use(express.json());

app.use("/api/v1/order",orderRouter);




app.listen(3000,()=>{
    console.log(`Server is running on port 3000`);
})