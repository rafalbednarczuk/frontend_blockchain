import React from 'react';
import {TonConnectButton} from "@tonconnect/ui-react";
import {useParams, Route, Routes, Link, useLocation} from 'react-router-dom';
import {ArrowLeft} from 'lucide-react';
import Chart from './Chart';
import Swap from './Swap';
import MemeCoinList from './MemeCoinList';
import JettonHoldersList from './JettonHoldersList';
import {useMinterBCContract} from './hooks/useJettonMinterBC';
import './App.css';

function CoinView() {
    const {address} = useParams<{ address: string }>();
    const {buyCoins} = useMinterBCContract(address || "");

    return (
        <div className="content-wrapper">
            <div className="top-section">
                <div className="chart-container">
                    <Chart/>
                </div>
                <div className="right-section">
                    <div className="swap-container">
                        <Swap buyCoins={buyCoins}/>
                    </div>
                    <div className="bottom-section">
                        <JettonHoldersList/>
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    const location = useLocation();

    return (
        <div className="app-wrapper">
            <header className="app-header">
                <div className="header-left">
                    {location.pathname !== "/" && (
                        <Link to="/" className="back-button">
                            <ArrowLeft size={24}/>
                            Back
                        </Link>
                    )}
                </div>
                <div className="header-right">
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