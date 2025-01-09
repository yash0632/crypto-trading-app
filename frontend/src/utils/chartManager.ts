import {
    ColorType,
    ISeriesApi,
    UTCTimestamp,
    createChart as createLightWeightChart,
    CrosshairMode
} from 'lightweight-charts';


export class ChartManager{
    private candleSeries : ISeriesApi<"Candlestick">;
    private lastUpdateTime : number = 0;
    private chart : any;
    
    constructor(
        ref:any,
        initialData:any[],
        layout:{background:any,color:string}
    ){
        const chart = createLightWeightChart(ref.current,{
            layout:{
                background:{
                    type:ColorType.Solid,
                    color:layout.background
                },
                textColor:"white",
            },
            grid: {
                vertLines: {
                  color: '#334158',
                },
                horzLines: {
                  color: '#334158',
                },
              },
            crosshair: {
                mode: CrosshairMode.Normal,
            },
            timeScale: {
                borderColor: '#485c7b',
            },
        })
        this.chart = chart;
        this.candleSeries = chart.addCandlestickSeries();
        console.log("initialDat:",initialData);
        this.candleSeries.setData(
            initialData.map((data)=>({
                ...data,
                time: Math.floor(new Date(data.timeStamp).getTime() / 1000) as UTCTimestamp
            }))
        )
    }

    public update(updatedPrice : any){
        if(!this.lastUpdateTime){
            this.lastUpdateTime = new Date().getTime();      
        }

        this.candleSeries.update({
            time:(this.lastUpdateTime/1000) as UTCTimestamp,
            open:updatedPrice.open,
            close:updatedPrice.close,
            high:updatedPrice.high,
            low:updatedPrice.low
        })

        if(updatedPrice.newCandleInitiated){
            this.lastUpdateTime = updatedPrice.time * 1000;
        }
    }

    public destroy(){
        this.chart.remove();
    }
}
