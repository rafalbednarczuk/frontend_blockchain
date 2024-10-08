import React, {useState, ChangeEvent} from 'react';
import {useTonConnect} from "./hooks/useTonConnect";
import {useJettonWalletContract} from "./hooks/useJettonWallet";
import {ArrowDownUp, RefreshCw} from 'lucide-react';
import {useParams} from 'react-router-dom';
import './Swap.css';
import {useMinterBCContract} from "./hooks/useJettonMinterBC.ts";


const Swap: React.FC = () => {
    const {address} = useParams<{ address: string }>();
    const {connected} = useTonConnect();
    const {sellCoins} = useJettonWalletContract(address || "");
    const {buyCoins} = useMinterBCContract(address || "");
    const [sendAmount, setSendAmount] = useState<string>("");
    const [receiveAmount, setReceiveAmount] = useState<string>("");
    const [isSendingTon, setIsSendingTon] = useState<boolean>(true);

    const TON_TO_DUPC_RATE = 100000;
    const TON_TO_USD_RATE = 5.30;

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

    const calculateUSDValue = (amount: string, isTon: boolean): string => {
        if (!amount) return "0.00";
        const parsedAmount = parseFloat(amount);
        if (isTon) {
            return (parsedAmount * TON_TO_USD_RATE).toFixed(2);
        } else {
            return ((parsedAmount / TON_TO_DUPC_RATE) * TON_TO_USD_RATE).toFixed(2);
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
    );
};

export default Swap;