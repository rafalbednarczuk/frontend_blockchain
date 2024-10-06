import React, {useEffect, useRef} from 'react';
import {createChart, ColorType, UTCTimestamp, LineWidth} from 'lightweight-charts';
import './Chart.css';

interface CandleData {
    time: UTCTimestamp;
    open: number;
    high: number;
    low: number;
    close: number;
}

const generateSampleData = (numPoints: number): CandleData[] => {
    const data: CandleData[] = [];
    const now = new Date();
    let price = 0.00005; // Starting price in the middle of the range

    for (let i = 0; i < numPoints; i++) {
        const time = new Date(now.getTime() - (numPoints - i) * 15 * 60000); // 15 minutes between points

        // Random walk
        const change = (Math.random() - 0.5) * 0.000001;
        price += change;

        // Ensure price stays within the specified range
        price = Math.max(0.00001, Math.min(0.0001, price));

        const open = i === 0 ? price : data[i - 1].close;
        const close = price;
        const high = Math.max(open, close) + Math.random() * 0.0000001;
        const low = Math.min(open, close) - Math.random() * 0.0000001;

        data.push({
            time: (time.getTime() / 1000) as UTCTimestamp,
            open,
            high,
            low,
            close
        });
    }

    return data;
};

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
                timeScale: {
                    timeVisible: true,
                    secondsVisible: false,
                },
                crosshair: {
                    mode: 1,
                    vertLine: {
                        width: 1 as LineWidth,
                        color: '#C3BCDB44',
                        style: 0,
                        labelBackgroundColor: '#9B7DFF',
                    },
                    horzLine: {
                        color: '#9B7DFF',
                        labelBackgroundColor: '#9B7DFF',
                    },
                },
            });

            const candlestickSeries = chart.addCandlestickSeries({
                upColor: '#26a69a',
                downColor: '#ef5350',
                borderVisible: false,
                wickUpColor: '#26a69a',
                wickDownColor: '#ef5350',
                priceFormat: {
                    type: 'custom',
                    formatter: (price: number) => price.toFixed(8),
                    minMove: 0.00000001,
                },
            });

            const data = generateSampleData(200);
            candlestickSeries.setData(data);

            // Set y-axis scale with improved precision
            chart.priceScale('right').applyOptions({
                scaleMargins: {
                    top: 0.1,
                    bottom: 0.1,
                },
                borderVisible: false,
                autoScale: true,
                entireTextOnly: false,
                mode: 0, // Normal scale
                alignLabels: true,
                borderColor: '#2B2B43',
            });

            chartRef.current = chart;

            return () => {
                chart.remove();
            };
        }
    }, []);

    return <div ref={chartContainerRef} className="chart"/>;
};

export default Chart;