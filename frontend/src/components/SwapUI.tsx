import {useState} from 'react'
import {useForm,SubmitHandler} from 'react-hook-form'


const SwapUI = ({market}:{market:string}) => {
    const [activeTab,setActiveTab] = useState('buy');
    const [type,setType] = useState("limit")
    const [price,setPrice] = useState<string>("");
    const[quantity,setQuantity] = useState<string>("");
    

  return (
    <div>
        <div className="flex flex-col">
            <div className="flex flex-row w-full h-[60px]">
                <div className={`font-bold border-b-2   border-solid  w-1/2 flex justify-center items-center cursor-pointer ${activeTab=="buy"?'border-green-900 bg-opacity-50 bg-green-900 ':'border-baseBackgroundMed bg-black bg-opacity-40'}`}
                onClick={()=>{
                    setActiveTab('buy')
                }}
                >
                    Buy
                </div>
                <div className={`font-bold border-b-2  border-solid w-1/2 flex justify-center items-center cursor-pointer ${activeTab=="sell"?'border-redBorder  bg-redBackgroundTransparent':'border-baseBackgroundMed bg-black bg-opacity-40'}`} onClick={()=>{
                    setActiveTab("sell");
                }}>
                    Sell
                </div>
            </div>
            <div className="flex flex-col gap-1 p-2">
                <div className="flex flex-row space-x-6">
                    <button
                    onClick={()=>{
                        setType("limit")
                    }}
                    className={`font-medium text-sm
                        ${type=="market"&&'hover:border-white pb-1 border-b-2'}
                      ${type=='limit'?'pb-1 border-b-2 border-green-500 border-solid':'pb-1 border-b-2 border-transparent border-solid'}`}>Limit</button>
                    <button
                    onClick={()=>{
                        setType("market")
                    }}
                     className={`font-medium text-sm 
                     ${type=="limit"&&'hover:border-white pb-1 border-b-2'}
                     ${type=='market'?'pb-1 border-b-2 border-green-500 border-solid':'pb-1 border-b-2 border-transparent border-solid'}`}>Market</button>
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-row justify-between items-center">
                        <p className="text-xs text-baseTextMidEmphasis">Available Balance</p>
                        <p className="text-xs text-baseTextHighEmphasis">36.94 USDC</p>
                    </div>
                </div>
                <div className="flex flex-col space-y-2">
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-normal text-baseTextHighEmphasis">Price</label>
                        <div className="flex flex-col relative">
                            <input placeholder="0" className="h-12 rounded-lg border-2 border-solid bg-baseBackgroundL2 border-slate-700 pr-12 text-right text-2xl leading-9 ring-0 transition focus:border-red-200 focus:ring-0" type="text"
                            
                            
                            onChange={(e)=>{
                                const inputValue = e.target.value;
                                if(/^\d*\.?\d{0,2}$/.test(inputValue)){
                                    setPrice(inputValue)
                                }
                                
                            }}
                            value={price}
                            ></input>
                            <div className="flex flex-row absolute right-1 top-50% p-2">
                                <div className="relative">
                                    <img 
                                    
                                    src="/usdc.webp"
                                    height={"30"}
                                    width="30"
                                    ></img>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-xs font-normal text-baseTextHighEmphasis">Quantity</label>
                        <div className="flex flex-col relative">
                            <input placeholder="0" className="h-12 rounded-lg border-2 border-solid 
                            bg-baseBackgroundL2
                            border-slate-700 pr-12 text-right ring-0 text-2xl leading-9 transition focus:border-red-200 " type="text"
                            onChange={(e)=>{
                                const inputValue = e.target.value;
                                if(/^\d*\.?\d{0,2}$/.test(inputValue)){
                                    setQuantity(inputValue)
                                }
                                
                            }}
                            value={quantity}
                            ></input>
                            <div className="flex flex-row absolute right-1 top-50% p-2">
                                <div className="relative">
                                    <img 
                                    
                                    src="/sol.webp"
                                    height={"30"}
                                    width="30"
                                    ></img>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
                <div className="h-6">
                    <div className="relative">
                        <p className="text-xs absolute right-1 top-1">0.00 {market.split("_")[1]}</p>
                    </div>
                </div>

                <div className="h-10 flex flex-row space-x-4">
                        <div className="rounded-l-2xl rounded-r-2xl bg-neutral-800 text-sm h-8 w-14 flex justify-center items-center cursor-pointer">
                            <p className="text-sm">25%</p>
                        </div>
                        <div className="rounded-l-2xl rounded-r-2xl bg-neutral-800 text-sm h-8 w-14 flex justify-center items-center cursor-pointer"
                        >
                            <p className="text-sm">50%</p>
                        </div>
                        <div className="rounded-l-2xl rounded-r-2xl bg-neutral-800 text-sm h-8 w-14 flex justify-center items-center cursor-pointer">
                            <p className="text-sm">75%</p>
                        </div>
                        <div className="rounded-l-2xl rounded-r-2xl bg-neutral-800 text-sm h-8 w-14 flex justify-center items-center cursor-pointer">
                            <p className="text-sm">Max</p>
                        </div>
                </div>

                <div className="my-2 rounded-xl bg-green-400 h-14 flex justify-center items-center cursor-pointer">
                    <p className="text-lg text-black tabular-num font-medium">Buy</p>
                </div>

                <div className="flex justify-start items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <input type="checkbox" className="h-4 w-4" />
                        <p className="text-sm">Post Only</p>
                    </div>
                    <div className="flex items-center space-x-2">
                        <input type="checkbox"
                        className="h-4 w-4"/>
                        <p className="text-sm">IOC</p>
                    </div>
                    

                </div>
            </div>
        </div>
    </div>
  )
}

export default SwapUI

// i want a react react input component which only allows +ve values and upto 2decimals