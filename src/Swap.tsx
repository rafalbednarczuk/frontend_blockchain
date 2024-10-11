import React, {useState, ChangeEvent, useEffect} from 'react';
import {useTonConnect} from "./hooks/useTonConnect";
import {useJettonWalletContract} from "./hooks/useJettonWallet";
import {ArrowDownUp, RefreshCw} from 'lucide-react';
import {useParams} from 'react-router-dom';
import './Swap.css';
import {JettonMetadata} from "@ton-api/client";
import {Address} from "@ton/core";

interface SwapProps {
    metadata: JettonMetadata;
    bondingCurveAddress: Address | undefined;
    buyCoins: Function;
    userJettonWalletAddress: Address | null;
}

const Swap: React.FC<SwapProps> = ({metadata, buyCoins, userJettonWalletAddress}) => {
    const {address} = useParams<{ address: string }>();
    const {connected} = useTonConnect();
    console.log(`Swap.tsxUserJettonWalletAddress:${userJettonWalletAddress}`);
    const {sellCoins} = useJettonWalletContract(address || "", userJettonWalletAddress?.toString() || "");
    const [sendAmount, setSendAmount] = useState<string>("");
    const [receiveAmount, setReceiveAmount] = useState<string>("");
    const [isSendingTon, setIsSendingTon] = useState<boolean>(true);

    const TON_TO_TOKEN_RATE = 100000; // This should be dynamically fetched or calculated
    const TON_TO_USD_RATE = 5.30; // This should be dynamically fetched


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
            return (parsedAmount * TON_TO_TOKEN_RATE).toFixed(0);
        } else {
            return (parsedAmount / TON_TO_TOKEN_RATE).toFixed(8);
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
        return isTon ? parsedAmount.toFixed(8) : parsedAmount.toLocaleString('en-US', {maximumFractionDigits: parseInt(metadata.decimals)});
    };

    const calculateUSDValue = (amount: string, isTon: boolean): string => {
        if (!amount) return "0.00";
        const parsedAmount = parseFloat(amount);
        if (isTon) {
            return (parsedAmount * TON_TO_USD_RATE).toFixed(2);
        } else {
            return ((parsedAmount / TON_TO_TOKEN_RATE) * TON_TO_USD_RATE).toFixed(2);
        }
    };

    return (
        <div className="swap-card">
            <h2 className="swap-title">Swap tokens</h2>

            <div className="swap-input-container">
                <div className="swap-input">
                    <div className="swap-input-header">
                        <span>You send</span>
                        <span>≈ ${calculateUSDValue(sendAmount, isSendingTon)}</span>
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
                                    src={isSendingTon ? "https://ton.org/download/ton_symbol.png" : metadata.image || ""}
                                    alt={isSendingTon ? "TON logo" : `${metadata.symbol} logo`}
                                    className="token-icon"
                                />
                            </div>
                            <span>{isSendingTon ? "TON" : metadata.symbol}</span>
                        </div>
                    </div>
                </div>

                <button onClick={handleFlip} className="flip-button">
                    <ArrowDownUp size={20}/>
                </button>

                <div className="swap-input">
                    <div className="swap-input-header">
                        <span>You receive</span>
                        <span>≈ ${calculateUSDValue(receiveAmount, !isSendingTon)}</span>
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
                                    src={isSendingTon ? metadata.image || "" : "https://ton.org/download/ton_symbol.png"}
                                    alt={isSendingTon ? `${metadata.symbol} logo` : "TON logo"}
                                    className="token-icon"
                                />
                            </div>
                            <span>{isSendingTon ? metadata.symbol : "TON"}</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="swap-info">
                <span>1 {isSendingTon ? "TON" : metadata.symbol} ≈ {isSendingTon ? TON_TO_TOKEN_RATE.toLocaleString() : (1 / TON_TO_TOKEN_RATE).toFixed(8)} {isSendingTon ? metadata.symbol : "TON"}</span>
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
    );
};

export default Swap;