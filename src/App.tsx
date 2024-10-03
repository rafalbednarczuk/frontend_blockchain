import React from 'react';
import "./App.css";
import { TonConnectButton } from "@tonconnect/ui-react";
import { useMinterBCContract } from "./hooks/useMinterBCContract";
import { useTonConnect } from "./hooks/useTonConnect.ts";
import { fromNano } from "@ton/ton";
import BuySellComponent from './components/BuySellComponent';
import ChartComponent from './components/ChartComponent';

function App() {
    const {
        contract_address,
        total_supply,
        admin_address,
        user_jetton_wallet,
        getJettonWalletAddress,
    } = useMinterBCContract();

    const { connected } = useTonConnect();

    return (
        <div className="Container">
            <div className="Header">
                <div className="TonConnectButtonWrapper">
                    <TonConnectButton />
                </div>
            </div>
            <div className="Content">
                <div className='Card'>
                    <h2>Minter Contract</h2>
                    <b>MinterBC Contract Address</b>
                    <div className='Hint'>{contract_address}</div>
                    <b>Total coins supply</b>
                    {total_supply != null && (
                        <div className='Hint'>{fromNano(total_supply)} DupCoins</div>
                    )}
                </div>
                <div className="ChartAndTrade">
                    <ChartComponent />
                    <BuySellComponent />
                </div>
            </div>
            <div className="Footer">
                <div className='Card'>
                    <b>Admin Address</b>
                    <div>{admin_address?.toString() ?? "Loading..."}</div>
                </div>
                <div className='Card'>
                    <b>My Jetton wallet address</b>
                    <div>{user_jetton_wallet?.toString() ?? "Loading..."}</div>
                </div>
            </div>
        </div>
    );
}

export default App;