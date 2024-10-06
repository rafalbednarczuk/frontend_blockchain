import "./App.css";
import {TonConnectButton} from "@tonconnect/ui-react";
import {useMinterBCContract} from "./hooks/useJettonMinterBC.ts";
import {fromNano} from "@ton/core";
import {useTonConnect} from "./hooks/useTonConnect.ts";
import {useJettonWalletContract} from "./hooks/useJettonWallet.ts";

function App() {
    const {
        minterAddress,
        totalSupply,
        buyCoins,
    } = useMinterBCContract();

    const {
        sellCoins,
    } = useJettonWalletContract();

    const {connected} = useTonConnect();
    return (
        <div>
            <div>
                <TonConnectButton/>
            </div>
            <div>
                <div className='Card'>
                    <b>Our contract Address</b>
                    <div className='Hint'>{minterAddress}</div>
                    <b>Total supply</b>
                    <div
                        className='Hint'>{totalSupply == null ? "Loading" : (fromNano(totalSupply.toString())) + " DUPCoins"}</div>
                </div>
                {connected && (
                    <a
                        onClick={() => {
                            buyCoins("1");
                        }}
                    >
                        BuyCoins
                    </a>
                )}
                <br/> {/* Add this line break */}
                {connected && (
                    <a
                        onClick={() => {
                            sellCoins("5000");
                        }}
                    >
                        SellCoins
                    </a>
                )}
            </div>
        </div>
    );
}

export default App;