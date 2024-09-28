import "./App.css";
import {TonConnectButton} from "@tonconnect/ui-react";
import {useMainContract} from "./hooks/useMainContract";
import {useTonConnect} from "./hooks/useTonConnect.ts";
import {fromNano} from "@ton/ton";
import WebApp from "@twa-dev/sdk";

function App() {
    const {
        contract_address,
        counter_value,
        contract_balance,
        sendIncrement,
        sendDeposit,
        sendWithdrawalRequest,
    } = useMainContract();

    const {connected} = useTonConnect();

    const showAlert = () => {
        WebApp.showAlert("Ale alert!");
    }

    return (
        <div>
            <div>
                <TonConnectButton/>
            </div>
            <div>
                <div className='Card'>
                    <b>Platform {WebApp.platform}</b>
                    <b>Our contract Address</b>
                    <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
                    <b>Our contract Balance</b>
                    {contract_balance && (
                        <div className='Hint'>{fromNano(contract_balance)}</div>
                    )}
                </div>

                <div className='Card'>
                    <b>Counter Value</b>
                    <div>{counter_value ?? "Loading..."}</div>
                </div>

                <a onClick={() => {
                    showAlert();
                }}>
                    Show alert!
                </a>
                <br/>
                {connected && (
                    <a onClick={() => {
                        sendIncrement();
                    }}>
                        Increment by 5
                    </a>
                )}
                <br/>
                {connected && (
                    <a onClick={() => {
                        sendDeposit();
                    }}>
                        Send 1TON deposit
                    </a>
                )}
                <br/>
                {connected && (
                    <a onClick={() => {
                        sendWithdrawalRequest();
                    }}>
                        Send 1TON withdrawal request
                    </a>
                )}
            </div>
        </div>
    );
}

export default App;

