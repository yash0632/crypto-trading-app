export const CREATE_ORDER = "CREATE_ORDER";
export const CANCEL_ORDER = "CANCEL_ORDER";
export const ON_RAMP = "ON_RAMP";

export const GET_DEPTH = "GET_DEPTH";
export const GET_OPEN_ORDERS = "GET_OPEN_ORDERS";

export type MessageFromApi = {
    type: typeof CREATE_ORDER,
    data:{
        market:string,
        price:string,
        quantity:string,
        side:"buy"|"sell",
        userId:string
    }
} | {
    type: typeof CANCEL_ORDER,
    data:{
        orderId:string,
        market:string
    }
} | {
    type: typeof ON_RAMP,
    data:{
        userId:string,
        market:string
    }
} | {
    type: typeof GET_DEPTH,
    data:{
        market:string
    }
} | {
    type: typeof GET_OPEN_ORDERS,
    data:{
        market:string,
        userId:string
    }
}