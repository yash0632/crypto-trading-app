"use client"
import { ChartManager } from '@/utils/chartManager'
import React,{useRef,useEffect} from 'react'
import { kLine } from '@/utils/httpClient'
import { kLineTestData } from '@/utils/kLinesTest'


const TradeView = ({market}:{market:string}) => {
  const chartRef = useRef<HTMLDivElement>(null)
  const chartManagerRef=useRef<ChartManager|null>(null)

  useEffect(()=>{
    const init = async()=>{
      let kLineData = kLineTestData || [];
    
      // try{
      //   kLineData = await kLine(market,"1h",Math.floor((new Date().getTime() - 1000*60*60*24*7)/1000),Math.floor(new Date().getTime()/1000));
      // }catch(e){
      //   console.log(e)
      // }

      if(chartRef){
        if(chartManagerRef.current){
          chartManagerRef.current.destroy();
        }
        console.log(kLineData);
        const chartManager = new ChartManager(chartRef,[
            ...kLineData?.map((x)=>({
              close:parseFloat(x.close),
              high : parseFloat(x.high),
              low : parseFloat(x.low),
              open : parseFloat(x.open),
              timeStamp: new Date(x.end)
            }))
          ].sort((x,y)=>x.timeStamp < y.timeStamp ? -1 : 1) || [],
          {
            background: "#0e0f14",
            color: "white",
          }
        )

        chartManagerRef.current = chartManager;
        console.log("chartManager Created"); 
      }
      
    }

    init();
  },[market,chartRef])

  return (
    <div ref={chartRef} style={{ height: "520px", width: "100%", marginTop: 4 }}></div>
  )
}

export default TradeView