import axios from 'axios'
import { Ticker } from './types';
const BASE_URL = 'api.backpack.exchange'
export async function getTicker(market:string):Promise<Ticker>{
    
        const tickers = await getTickers()
        const ticker = tickers.find((ticker:any)=>{
            return ticker.symbol == market;
        })
        if(!ticker){
            throw new Error("no ticker found for " + market)
        }
        return ticker
    
}

export async function getTickers():Promise<number>{
    
        //const response = await axios.get(`${BASE_URL}/api/v1/tickers`);
        const response:any = await new Promise((resolve)=>{
            setTimeout(()=>{
                resolve(1);
            },2000)
        })
        
        return response.data;
    
}


export async function getDepth({market}:{market:string}){
    const response = await new Promise((resolve)=>{
        setTimeout(()=>{resolve(1)},1000)
    })
    //const response = await axios.get(`https://${BASE_URL}/api/v1/depth?symbol=${market}`)
    return response.data;
}


export async function getTrades({market}:{market:string}){
    const response:any = await new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(1);
        },2000)
    })
    //const response = await axios.get(`${BASE_URL}/api/v1/trades?symbol=${market}&limit=50`)
    return response.data;
}


export async function kLine(market:string,period:string,startTime:number,endTime:number){
    const response = new Promise((resolve)=>{
        setTimeout(()=>{
            resolve(1);
        },2000)
    })
    return response.data;
}