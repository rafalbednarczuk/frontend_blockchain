import React, {useEffect, useRef} from 'react';
import {createChart, ColorType} from 'lightweight-charts';
import './Chart.css';

const Chart: React.FC = () => {
    const chartContainerRef = useRef<HTMLDivElement>(null);
    const chartRef = useRef<any>(null);

    useEffect(() => {
        if (chartContainerRef.current) {
            const chart = createChart(chartContainerRef.current, {
                layout: {
                    background: {type: ColorType.Solid, color: '#1E222D'},
                    textColor: 'white',
                },
                width: chartContainerRef.current.clientWidth,
                height: 400,
                grid: {
                    vertLines: {color: 'rgba(42, 46, 57, 0)'},
                    horzLines: {color: 'rgba(42, 46, 57, 0.6)'},
                },
            });

            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
            });

            // Sample data - replace with real data
            const data = [
                {time: '2023-06-01', open: 80000, high: 90000, low: 78000, close: 85000},
                {time: '2023-06-02', open: 85000, high: 95000, low: 82000, close: 90000},
                {time: '2023-06-03', open: 90000, high: 100000, low: 85000, close: 95000},
                // Add more data points as needed
            ];

            candlestickSeries.setData(data);

            chartRef.current = chart;

            return () => {
                chart.remove();
            };
        }
    }, []);

    return <div ref={chartContainerRef} className="chart"/>;
};

export default Chart;