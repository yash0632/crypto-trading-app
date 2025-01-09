"use client";
import {useState,useEffect} from 'react'

import { Ticker } from "@/utils/types";
import { getTicker } from "@/utils/httpClient";
import Link from "next/link";
import Image from "next/image";
import { SignalingManager } from '@/utils/SignalingManager';

const MarketBar = ({ market }: { market: string }) => {
  const [ticker, setTicker] = useState<Ticker | null>(null);



  useEffect(() => {
    getTicker(market).then((tickerData: Ticker) => {
      setTicker(tickerData);
    });

    //@ts-ignore
    SignalingManager.getInstance().registerCallback("bookTicker",(data:Partial<Ticker>)=>{
      setTicker((prevTicker)=>({
        firstPrice: data?.firstPrice || prevTicker?.firstPrice || "",
        high: data.high || prevTicker?.high || "",
        lastPrice:data?.lastPrice || prevTicker?.lastPrice || "",
        low: data?.low || prevTicker?.low || "",
        priceChange: data.priceChange || prevTicker?.priceChange || "",
        priceChangePercent: data?.priceChangePercent || prevTicker?.priceChangePercent || "",
        symbol: data?.symbol || prevTicker?.symbol || "",
        trades: data?.trades || prevTicker?.trades || "",
        volume: data?.volume || prevTicker?.volume || "",
      }));
    },`TICKER-${market}`)

    SignalingManager.getInstance().sendMessage({
      "method":"SUBSCRIBE",
      "params":[`bookTicker.${market}`]
    })


    return ()=>{
      SignalingManager.getInstance().deregisterCallback("ticker",`TICKER-${market}`);
      SignalingManager.getInstance().sendMessage({
        "method":"UNSUBSCRIBE",
        "params":[`bookTicker.${market}`]
      })
    }




  }, [market]);
  return (
    <div className="w-[896.67px]">
      <div className="flex items-center flex-row relative w-full overflow-hidden border-b border-slate-800">
        <div className="flex items-center justify-between flex-row no-scrollbar overflow-auto pr-4">
          <TickerComponent market={market as string} />
          <div className="flex items-center flex-row space-x-8 pl-4">
            <div className="flex flex-col h-full justify-center">
              <p
                className={`font-medium tabular-nums ${
                  true ? "text-greenText" : "text-redText"
                }`}
              >
                {ticker?.lastPrice || 24}
              </p>
              <p className="font-medium text-baseTextHighEmphasis text-left text-s tabular-nums">
                  {ticker?.lastPrice || 24}
              </p>
            </div>
            <div className="flex flex-col relative justify-center">
              <p className="text-baseTextMidEmphasis font-medium text-xs">
                24H Change
              </p>
              <span
                className={`mt-1 text-sm font-normal tabular-nums leading-4 text-baseTextHighEmphasis ${
                  Number(ticker?.priceChange) > 0  ? "text-greenText" : "text-redText"
                }`}
              >
                {Number(ticker?.priceChange) > 0 ? "+" : ""}{Number(ticker?.priceChange)} {Number(ticker?.priceChangePercent).toFixed(2)}%
              </span>
            </div>
            <div className="flex flex-col justify-center relative">
              <p className="text-baseTextMidEmphasis font-medium text-xs">
                24H High
              </p>
              <span className="text-baseTextHighEmphasis leading-4 tabular-nums mt-1 font-normal">
                {ticker?.high}
              </span>
            </div>
            <div className="flex flex-col justify-center relative">
              <p className="text-baseTextMidEmphasis font-medium text-xs">
                24H Low
              </p>
              <span className="text-baseTextHighEmphasis leading-4 tabular-nums mt-1 font-normal">
                {ticker?.low}
              </span>
            </div>
            <div className="flex flex-col justify-center relative">
              <p className="text-baseTextMidEmphasis font-medium text-xs">
                24H Volume(USD)
              </p>
              <span className="text-baseTextHighEmphasis leading-4 tabular-nums mt-1 font-normal">
                {ticker?.volume}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MarketBar;

function TickerComponent({ market }: { market: string }) {
  return (
    <div className="flex h-[60px] shrink-0 ">
      <div className="flex flex-row relative ml-2 ">
        <img
          alt="SOL Logo"
          loading="lazy"
          decoding="async"
          dat-nimg="1"
          className="z-10 rounded-full h-6 w-6 mt-4 outline-baseBackgroundL1"
          src="/sol.webp"
        />
        <img
          alt="USDC Logo"
          loading="lazy"
          decoding="async"
          data-nimg="1"
          className="relative  h-6 w-6 rounded-full mt-4 right-1"
          src="/usdc.webp"
        />
      </div>
      <button type="button" className="react-aria-Button -ml-2" data-rac="">
        <div className="flex items-center justify-between flex-row cursor-pointer rounded-lg p-3 hover:opacity-80">
          <div className="flex items-center flex-row gap-2 undefined">
            <div className="flex flex-row relative">
              <p className="font-medium text-sm undefined">
                {market.replace("_", " / ")}
              </p>
            </div>
          </div>
        </div>
      </button>
    </div>
  );
}
