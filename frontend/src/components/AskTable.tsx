import React from "react";

const AskTable = ({ asks }: { asks: string[][] }) => {
  let newAsks:number[][] = [];
  const asksArray = [];
  if(asks){
    for(let i = 0;i < asks.length;i++){
      newAsks.push([Number(parseFloat(asks[i][0]).toFixed(2)),Number(parseFloat(asks[i][1]).toFixed(2))])
    }
    newAsks.sort();
    let totalSum = 0;
    let askTotalSumArray = newAsks.map((ask) => {
      totalSum += Math.floor(ask[1] * 100);
      return totalSum;
    });
    askTotalSumArray = askTotalSumArray.reverse();
    const reversedAsks = newAsks.reverse();
  
    
    for (let i = 0; i < reversedAsks.length; i++) {
      const asks_comp_array = [];
      asks_comp_array.push(reversedAsks[i][0]);
      asks_comp_array.push(reversedAsks[i][1]);
      asks_comp_array.push(askTotalSumArray[i] / 100);
      asksArray.push(asks_comp_array);
    }
  }
  
  return (
    <div>
      {asksArray.map((ask, idx) => (
        <AskComponent
          askPrice={ask[0]}
          askQuantity={ask[1]}
          askTotal={ask[2]}
        ></AskComponent>
      ))}
    </div>
  );
};

export default AskTable;

function AskComponent({
  askPrice,
  askQuantity,
  askTotal,
}: {
  askPrice: number;
  askQuantity: number;
  askTotal: number;
}) {
    let lightRed = askQuantity/1000;
    let darkRed = askTotal/1000;
  return (
    <div className="h-[25px]">
      <div className="flex items-center flex-row relative h-full w-full overflow-hidden px-3 border-b border-dashed border-transparent hover:border-baseBorderFocus/50 gap-x-4">
        <div
          className={`absolute top-[1px] bottom-[1px] right-[12px] bg-[rgba(253,75,78,0.16)] transition-[width] duration-400 ease-in-out`}
          style={{ width: `${lightRed * 100}%` }}
        ></div>
        <div
          className={`absolute top-[1px] bottom-[1px] right-[12px]  bg-[rgba(253,75,78,0.32)] transition-[width] duration-400 ease-in-out`}
          style={{ width: `${darkRed * 100}%` }}
        ></div>

        <p className="z-10 w-[30%] text-left text-xs font-normal tabular-nums text-redText/90">
          {askPrice}
        </p>

        <p className="z-10 w-[30%] text-left text-xs font-normal tabular-nums text-redText/90">
          {askQuantity}
        </p>

        <p className="z-10 w-[30%] text-left text-xs font-normal tabular-nums text-redText/90">
          {askTotal}
        </p>
      </div>
    </div>
  );
}
