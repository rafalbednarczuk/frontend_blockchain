import React from 'react';
import {TonConnectButton} from "@tonconnect/ui-react";
import {useParams, Route, Routes, Link, useLocation} from 'react-router-dom';
import {ArrowLeft, PlusCircle} from 'lucide-react';
import Chart from './Chart';
import Swap from './Swap';
import MemeCoinList from './MemeCoinList';
import JettonHoldersList from './JettonHoldersList';
import CreateCoin from './CreateCoin';
import './App.css';

function CoinView() {
    return (
        <div className="content-wrapper">
            <div className="top-section">
                <div className="chart-container">
                    <Chart/>
                </div>
                <div className="right-section">
                    <div className="swap-container">
                        <Swap/>
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
                        <Link to="/" className="header-button">
                            <ArrowLeft size={24}/>
                            Back
                        </Link>
                    )}
                </div>
                <div className="header-center">
                    <Link to="/launch-coin" className="header-button">
                        <PlusCircle size={24}/>
                        Create your own jetton
                    </Link>
                </div>
                <div className="header-right">
                    <TonConnectButton/>
                </div>
            </header>
            <main className="app-main">
                <Routes>
                    <Route path="/" element={<MemeCoinList/>}/>
                    <Route path="/jetton/:address" element={<CoinView/>}/>
                    <Route path="/launch-coin" element={<CreateCoin/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;