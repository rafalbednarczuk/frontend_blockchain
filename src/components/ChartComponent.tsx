import React, {useEffect, useRef} from 'react';
import {createChart, ColorType} from 'lightweight-charts';
import {generateBitcoinLikeData} from './chartUtils';

const ChartComponent: React.FC = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (chartContainerRef.current) {
            const chart = createChart(chartContainerRef.current, {
                width: 600,
                height: 300,
                layout: {
                    background: {type: ColorType.Solid, color: '#1E222D'},
                    textColor: '#DDD',
                },
                grid: {
                    vertLines: {color: '#2B2B43'},
                    horzLines: {color: '#2B2B43'},
                },
                crosshair: {
                    mode: 0,
                },
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                    borderColor: '#485c7b',
                },
            });

            const candleSeries = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
                priceFormat: {
                    type: 'price',
                    precision: 2,
                    minMove: 0.01,
                },
            });

            const data = generateBitcoinLikeData(50);
            candleSeries.setData(data);

            // Set the visible range to fit all the data
            chart.timeScale().fitContent();

            return () => {
                chart.remove();
            };
        }
    }, []);

    return (
        <div className='Card ChartCard'>
            <h2>Bitcoin-like Price Chart</h2>
            <div ref={chartContainerRef}/>
        </div>
    );
};

export default ChartComponent;