"use client"

import React from 'react'
import {useParams} from 'next/navigation'
import MarketBar from '@/components/MarketBar'
import TradeView from '@/components/TradeView'
import SwapUI from '@/components/SwapUI'
import Depth from '@/components/Depth'
import DepthAndTrades from '@/components/Depth'

const page = () => {
    const {market} = useParams();

  return (
    <div className="flex flex-row ">
        <div className="flex flex-col flex-1 ">
            <div>
                <MarketBar market={market as string}/>
            </div>
            
            <div className="flex flex-row  h-[620px] border-y border-slate-800">
                <div className="flex flex-col flex-1 ">
                    <TradeView market={market as string}/>
                </div>
                <div className="w-[1px] flex-col border-slate-800 border-l"></div>
                <div className="flex flex-col max-w-[22.5rem] min-w-[15.625rem]
                ">
                    <DepthAndTrades market={market as string}/>
                </div>
            </div>
            
        </div>
        <div className="w-[1px] flex-col border-slate-800 border-l"></div>
        <div className="min-w-[15.625rem] max-w-[22.5rem]">
            <div className="bg-baseBackgroundL0 min-w-[15.625rem] max-w-[22.5rem]">
                <SwapUI market = {market as string}/>

            </div>
        </div>

    </div>
  )
}

export default page