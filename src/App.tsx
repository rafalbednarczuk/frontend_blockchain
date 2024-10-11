import React, {useState, useEffect} from 'react';
import {TonConnectButton, useTonAddress} from "@tonconnect/ui-react";
import {useParams, Route, Routes, useLocation, useNavigate} from 'react-router-dom';
import {ArrowLeft, PlusCircle} from 'lucide-react';
import {Address} from "@ton/core";
import Chart from './Chart';
import Swap from './Swap';
import MemeCoinList from './MemeCoinList';
import JettonHoldersList from './JettonHoldersList';
import CreateCoin from './CreateCoin';
import {useJettonMetadata} from './hooks/useJettonMetadata';
import {useMinterBCContract} from './hooks/useJettonMinterBC';
import './App.css';

function CoinView() {
    const {address} = useParams<{ address: string }>();
    const {getJsonMetadata} = useJettonMetadata(address || "");
    const {buyCoins, totalSupply, bondingCurveAddress, getJettonWalletAddress} = useMinterBCContract(address || "");
    const [metadata, setMetadata] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const userAddress = useTonAddress();
    const [userJettonWalletAddress, setUserJettonWalletAddress] = useState<Address | null>(null);

    useEffect(() => {
        async function fetchMetadata() {
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
        }

        fetchMetadata();
    }, [address, getJsonMetadata]);

    useEffect(() => {
        async function fetchUserJettonWalletAddress() {
            if (!userAddress || !getJettonWalletAddress) return;
            try {
                console.log(`CoinView: Fetching jetton wallet for user address: ${userAddress}`);
                const jettonWalletAddress = await getJettonWalletAddress(userAddress);
                console.log(`CoinView: Fetched jetton wallet address: ${jettonWalletAddress}`);
                if (jettonWalletAddress) {
                    setUserJettonWalletAddress(jettonWalletAddress);
                }
            } catch (error) {
                console.error('Error fetching user jetton wallet address:', error);
                setUserJettonWalletAddress(null);
            }
        }

        fetchUserJettonWalletAddress();
    }, [userAddress, getJettonWalletAddress]);

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
    const navigate = useNavigate();

    const handleBackClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/frontend_blockchain/');
    };

    const handleLaunchCoinClick = (e: React.MouseEvent) => {
        e.preventDefault();
        navigate('/frontend_blockchain/launch-coin');
    };

    return (
        <div className="app-wrapper">
            <header className="app-header">
                <div className="header-left">
                    {location.pathname !== "/frontend_blockchain/" && (
                        <button onClick={handleBackClick} className="header-button">
                            <ArrowLeft size={24}/>
                            Back
                        </button>
                    )}
                </div>
                <div className="header-center">
                    <button onClick={handleLaunchCoinClick} className="header-button">
                        <PlusCircle size={24}/>
                        Create your own jetton
                    </button>
                </div>
                <div className="header-right">
                    <TonConnectButton/>
                </div>
            </header>
            <main className="app-main">
                <Routes>
                    <Route path="/frontend_blockchain/" element={<MemeCoinList/>}/>
                    <Route path="/frontend_blockchain/jetton/:address" element={<CoinView/>}/>
                    <Route path="/frontend_blockchain/launch-coin" element={<CreateCoin/>}/>
                </Routes>
            </main>
        </div>
    );
}

export default App;