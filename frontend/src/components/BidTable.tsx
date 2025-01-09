"use client"
import React from 'react'


const BidTable = ({bids}:{bids:string[][]}) => {
    let bidsArrayNew = [];
    let newBids : number[][] = [];
    if(bids){
        for(let i = 0;i < bids.length;i++){
            newBids.push([Number(parseFloat(bids[i][0]).toFixed(2)),Number(parseFloat(bids[i][1]).toFixed(2))])
          }
          newBids = newBids.sort();
          
          const reverseBids = newBids.reverse();
          let total = 0;
          
          let totalsArray=[];
          for(let i = 0;i < reverseBids.length;i++){
              total = total + Math.floor(reverseBids[i][1]*100)
              totalsArray.push(total);
          }
          //console.log(totalsArray);
       
          let bidsArray = reverseBids.map((bid,idx)=>{
              
              return [bid[0],bid[1]];
          })
      
          //bidsArray = bidsArray.reverse();
      
          
          for(let i = 0;i < bidsArray.length;i++){
              let newArray=[];
              newArray.push(bidsArray[i][0]);
              newArray.push(bidsArray[i][1]);
              newArray.push(totalsArray[i]/100);
              bidsArrayNew.push(newArray);
          }
    }
    
    //console.log(bidsArrayNew);
    

  return (
    <div className="flex flex-col ">
        {bidsArrayNew.map((bid,idx)=>(
            <BidComponent key={idx} bidPrice={bid[0]} bidSize={bid[1]} bidTotal={bid[2]} ></BidComponent>
        )
        )}
    </div>
  )
}

export default BidTable

function BidComponent({
    bidPrice,
    bidSize,
    bidTotal
}:{
    bidPrice:number,
    bidSize:number,
    bidTotal:number
}){
    let lightGreen = bidSize/1000;
    let darkGreen = bidTotal/1000;
    return(
        <div className='h-[25px]'>
        <div className="flex items-center flex-row relative h-full w-full overflow-hidden px-3 border-b border-dashed border-transparent hover:border-baseBorderFocus/50 gap-x-4">
            <div className={`absolute top-[1px] bottom-[1px] right-[12px] bg-[rgba(0,194,120,0.32)] transition-[width] duration-400 ease-in-out`} style={{width:`${lightGreen * 100}%`}}
            ></div>
            <div className={`absolute top-[1px] bottom-[1px] right-[12px]  bg-[rgba(0,194,120,0.16)] transition-[width] duration-400 ease-in-out`} style={{width:`${darkGreen * 100}%`}}></div>
            
                <p className="z-10 w-[30%] text-left text-xs font-normal tabular-nums text-greenText/90">{bidPrice}</p>
                    
            
            
                <p className="z-10 w-[30%] text-left text-xs font-normal tabular-nums text-greenText/90">{bidSize}</p>
                    
            
            
                <p className="z-10 w-[30%] text-left text-xs font-normal tabular-nums text-greenText/90">{bidTotal}</p>
            
            
        </div>
        </div>
    )
}