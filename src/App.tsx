import React, {useState, useEffect, useRef} from 'react';
import {TonConnectButton, useTonAddress} from "@tonconnect/ui-react";
import {useParams, Route, Routes, Link, useLocation} from 'react-router-dom';
import {ArrowLeft, PlusCircle} from 'lucide-react';
import Chart from './Chart';
import Swap from './Swap';
import MemeCoinList from './MemeCoinList';
import JettonHoldersList from './JettonHoldersList';
import CreateCoin from './CreateCoin';
import {useJettonMetadata} from './hooks/useJettonMetadata';
import {useMinterBCContract} from './hooks/useJettonMinterBC';
import './App.css';
import {Address} from "@ton/core";

function CoinView() {
    const {address} = useParams<{ address: string }>();
    const {getJsonMetadata} = useJettonMetadata(address || "");
    const {buyCoins, totalSupply, bondingCurveAddress, getJettonWalletAddress} = useMinterBCContract(address || "");
    const [metadata, setMetadata] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userAddress = useTonAddress();
    const [userJettonWalletAddress, setUserJettonWalletAddress] = useState<Address | null>(null);
    const fetchingUserJettonWallet = useRef(false);
    const prevUserAddress = useRef<string | null>(null);

    useEffect(() => {
        async function fetchUserJettonWalletAddress() {
            if (fetchingUserJettonWallet.current || !userAddress || !getJettonWalletAddress) return;
            if (userAddress === prevUserAddress.current) return;

            fetchingUserJettonWallet.current = true;
            prevUserAddress.current = userAddress;

            try {
                const jettonWalletAddress = await getJettonWalletAddress(userAddress);
                setUserJettonWalletAddress(jettonWalletAddress || null);
            } catch (error) {
                console.error('Error fetching user jetton wallet address:', error);
                setUserJettonWalletAddress(null);
            } finally {
                fetchingUserJettonWallet.current = false;
            }
        }

        fetchUserJettonWalletAddress();
    }, [userAddress, getJettonWalletAddress]);
    useEffect(() => {
        const fetchMetadata = async () => {
            if (!address) return;
            try {
                const data = await getJsonMetadata();
                setMetadata(data);
            } catch (err) {
                console.error('Error fetching metadata:', err);
                setError('Failed to load coin metadata');
            } finally {
                setLoading(false);
            }
        };

        fetchMetadata();
    }, [address, getJsonMetadata]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!metadata) return <div>No metadata found</div>;

    return (
        <div className="content-wrapper">
            <div className="top-section">
                <div className="chart-container">
                    <Chart/>
                </div>
                <div className="right-section">
                    <div className="swap-container">
                        <Swap
                            metadata={metadata}
                            bondingCurveAddress={bondingCurveAddress}
                            buyCoins={buyCoins}
                            userJettonWalletAddress={userJettonWalletAddress}
                        />
                    </div>
                    <div className="bottom-section">
                        <JettonHoldersList
                            totalSupply={totalSupply}
                            bondingCurveAddress={bondingCurveAddress}
                            userJettonWalletAddress={userJettonWalletAddress}
                        />
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