import React from 'react';
import {TonConnectButton} from "@tonconnect/ui-react";
import {useParams, Route, Routes} from 'react-router-dom';
import Chart from './Chart';
import Swap from './Swap';
import MemeCoinList from './MemeCoinList';
import {useMinterBCContract} from './hooks/useJettonMinterBC';
import './App.css';

function CoinView() {
    const {address} = useParams<{ address: string }>();
    const {buyCoins} = useMinterBCContract(address || "");

    return (
        <div className="content-wrapper">
            <div className="chart-container">
                <Chart/>
            </div>
            <div className="swap-container">
                <Swap buyCoins={buyCoins}/>
            </div>
        </div>
    );
}

function App() {
    return (
        <div className="app-wrapper">
            <header className="app-header">
                <div className="connect-button-container">
                    <TonConnectButton/>
                </div>
            </header>
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<MemeCoinList/>}/>
                    <Route path="/:address" element={<CoinView/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;