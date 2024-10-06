import React from 'react';
import {TonConnectButton} from "@tonconnect/ui-react";
import Chart from './Chart';
import Swap from './Swap';
import './App.css';

function App() {
    return (
        <div className="app-wrapper">
            <header className="app-header">
                <div className="connect-button-container">
                    <TonConnectButton/>
                </div>
            </header>
            <main className="app-main">
                <div className="content-wrapper">
                    <div className="chart-container">
                        <Chart/>
                    </div>
                    <div className="swap-container">
                        <Swap/>
                    </div>
                </div>
            </main>
        </div>
    );
}

export default App;