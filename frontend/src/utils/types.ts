export interface Ticker {
  firstPrice: string;
  high: string;
  lastPrice: string;
  low: string;
  priceChange: string;
  priceChangePercent: string;
  symbol: string;
  trades: string;
  volume: string;
}

//{"data":{"A":"19.60","B":"56.02","E":1736172777506225,"T":1736172777497712,"a":"218.61","b":"218.58","e":"bookTicker","s":"SOL_USDC","u":1802083092},"stream":"bookTicker.SOL_USDC"}

//wss://ws.backpack.exchange/

//{"method":"SUBSCRIBE","params":["depth.200ms.SOL_USDC"],"id":2}

//{"data":{"A":"6.00","B":"46.30","E":1736189041277084,"T":1736189041197902,"a":"219.42","b":"219.38","e":"bookTicker","s":"SOL_USDC","u":1802736850},"stream":"bookTicker.SOL_USDC"}

//{"data":{"E":1736172778162587,"T":1736172778151673,"U":1802083134,"a":[["219.00","2.98"]],"b":[["218.12","0.02"],["218.60","22.35"],["218.61","13.88"]],"e":"depth","s":"SOL_USDC","u":1802083137},"stream":"depth.200ms.SOL_USDC"}

//{"data":{"E":1736186248745457,"T":1736186248744398,"a":"113782701997686784","b":"113782700596854784","e":"trade","m":true,"p":"218.50","q":"0.07","s":"SOL_USDC","t":341399899},"stream":"trade.SOL_USDC"}


//{"data":{"E":1736257764052341,"T":1736257764022406,"U":1803724440,"a":[["214.50","0.13"]],"b":[["214.07","21.41"]],"e":"depth","s":"SOL_USDC","u":1803724442},"stream":"depth.200ms.SOL_USDC"}
//{"data":{"E":1736257764052341,"T":1736257764022406,"U":1803724440,"a":[["214.50","0.13"]],"b":[["214.07","21.41"]],"e":"depth","s":"SOL_USDC","u":1803724442},"stream":"depth.200ms.SOL_USDC"}

//{"data":{"A":"20.52","B":"16.46","E":1736269138824511,"T":1736269138823600,"a":"207.52","b":"207.51","e":"bookTicker","s":"SOL_USDC","u":1804072087},"stream":"bookTicker.SOL_USDC"}	
//{"data":{"A":"20.52","B":"16.46","E":1736269138824511,"T":1736269138823600,"a":"207.52","b":"207.51","e":"bookTicker","s":"SOL_USDC","u":1804072087},"stream":"bookTicker.SOL_USDC"}	