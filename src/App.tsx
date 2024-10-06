import React, {useState, ChangeEvent, useEffect, useRef} from 'react';
import {TonConnectButton} from "@tonconnect/ui-react";
import {useMinterBCContract} from "./hooks/useJettonMinterBC";
import {useJettonWalletContract} from "./hooks/useJettonWallet";
import {useTonConnect} from "./hooks/useTonConnect";
import {ArrowDownUp, RefreshCw} from 'lucide-react';
import {createChart, ColorType} from 'lightweight-charts';
import './App.css';

const Chart = () => {
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

function App() {
    const {minterAddress, totalSupply, buyCoins} = useMinterBCContract();
    const {sellCoins} = useJettonWalletContract();
    const {connected} = useTonConnect();
    const [sendAmount, setSendAmount] = useState<string>("");
    const [receiveAmount, setReceiveAmount] = useState<string>("");
    const [isSendingTon, setIsSendingTon] = useState<boolean>(true);

    const TON_TO_DUPC_RATE = 100000;

    const handleSwap = () => {
        if (isSendingTon) {
            buyCoins(sendAmount);
        } else {
            sellCoins(sendAmount);
        }
    };

    const calculateReceiveAmount = (amount: string, fromTon: boolean): string => {
        if (!amount) return "";
        const parsedAmount = parseFloat(amount);
        if (fromTon) {
            return (parsedAmount * TON_TO_DUPC_RATE).toFixed(0);
        } else {
            return (parsedAmount / TON_TO_DUPC_RATE).toFixed(8);
        }
    };

    const handleFlip = () => {
        setIsSendingTon(!isSendingTon);
        setSendAmount(receiveAmount);
        setReceiveAmount(calculateReceiveAmount(receiveAmount, !isSendingTon));
    };

    const handleSendAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const amount = e.target.value;
        setSendAmount(amount);
        setReceiveAmount(calculateReceiveAmount(amount, isSendingTon));
    };

    const formatAmount = (amount: string, isTon: boolean): string => {
        if (!amount) return "0";
        const parsedAmount = parseFloat(amount);
        return isTon ? parsedAmount.toFixed(8) : parsedAmount.toLocaleString('en-US', {maximumFractionDigits: 0});
    };

    return (
        <div className="app-container">
            <div className="content-wrapper">
                <div className="chart-container">
                    <Chart/>
                </div>
                <div className="swap-container">
                    <div className="swap-card">
                        <div className="connect-button-container">
                            <TonConnectButton/>
                        </div>

                        <h2 className="swap-title">Swap tokens</h2>

                        <div className="swap-input-container">
                            <div className="swap-input">
                                <div className="swap-input-header">
                                    <span>You send</span>
                                    <span>≈ {sendAmount ? `$${(parseFloat(sendAmount) * (isSendingTon ? 2 : 0.00002)).toFixed(2)}` : "$0.00"}</span>
                                </div>
                                <div className="swap-input-body">
                                    <input
                                        type="number"
                                        value={sendAmount}
                                        onChange={handleSendAmountChange}
                                        placeholder="0"
                                    />
                                    <div className="token-selector">
                                        <div className="token-icon-wrapper">
                                            <img
                                                src={isSendingTon ? "https://ton.org/download/ton_symbol.png" : "https://i1.sndcdn.com/artworks-WL8TnfYG5XrRCMRM-5IjLig-t500x500.jpg"}
                                                alt={isSendingTon ? "TON logo" : "DUPC logo"}
                                                className="token-icon"
                                            />
                                        </div>
                                        <span>{isSendingTon ? "TON" : "DUPC"}</span>
                                    </div>
                                </div>
                            </div>

                            <button onClick={handleFlip} className="flip-button">
                                <ArrowDownUp size={20}/>
                            </button>

                            <div className="swap-input">
                                <div className="swap-input-header">
                                    <span>You receive</span>
                                    <span>≈ {receiveAmount ? `$${(parseFloat(receiveAmount) * (isSendingTon ? 0.00002 : 2)).toFixed(2)}` : "$0.00"}</span>
                                </div>
                                <div className="swap-input-body">
                                    <input
                                        type="text"
                                        value={formatAmount(receiveAmount, !isSendingTon)}
                                        readOnly
                                        placeholder="0"
                                    />
                                    <div className="token-selector">
                                        <div className="token-icon-wrapper">
                                            <img
                                                src={isSendingTon ? "https://i1.sndcdn.com/artworks-WL8TnfYG5XrRCMRM-5IjLig-t500x500.jpg" : "https://ton.org/download/ton_symbol.png"}
                                                alt={isSendingTon ? "DUPC logo" : "TON logo"}
                                                className="token-icon"
                                            />
                                        </div>
                                        <span>{isSendingTon ? "DUPC" : "TON"}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="swap-info">
                            <span>1 {isSendingTon ? "TON" : "DUPC"} ≈ {isSendingTon ? TON_TO_DUPC_RATE.toLocaleString() : (1 / TON_TO_DUPC_RATE).toFixed(8)} {isSendingTon ? "DUPC" : "TON"}</span>
                            <RefreshCw size={16}/>
                        </div>

                        <button
                            onClick={handleSwap}
                            disabled={!connected || !sendAmount}
                            className="swap-button"
                        >
                            {connected ? "Swap" : "Connect Wallet"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;