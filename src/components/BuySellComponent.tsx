import React, {useState} from 'react';
import {useMinterBCContract} from '../hooks/useMinterBCContract';
import {useJettonWalletContract} from '../hooks/useJettonWalletContract';

const BuySellComponent: React.FC = () => {
    const [amount, setAmount] = useState<string>('');
    const [action, setAction] = useState<'buy' | 'sell'>('buy');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    const {buyCoins} = useMinterBCContract();
    const {sellCoins} = useJettonWalletContract();

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setAmount(e.target.value);
    };

    const handleActionSelect = (selectedAction: 'buy' | 'sell') => {
        setAction(selectedAction);
    };

    const handleTrade = async () => {
        if (!amount) {
            setError('Please enter an amount');
            return;
        }
        setError(null);
        setIsLoading(true);

        try {
            if (action === 'buy') {
                await buyCoins(amount);
                console.log(`Buying ${amount} coins`);
            } else {
                await sellCoins(amount);
                console.log(`Selling ${amount} coins`);
            }
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(`Failed to ${action} coins: ${err.message}`);
            } else {
                setError(`An unknown error occurred while trying to ${action} coins`);
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="Card">
            <h3>Trade Crypto</h3>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '10px'}}>
                <button
                    onClick={() => handleActionSelect('buy')}
                    style={{
                        flex: 1,
                        marginRight: '5px',
                        backgroundColor: action === 'buy' ? '#4CAF50' : '',
                        color: action === 'buy' ? 'white' : '',
                        border: action === 'buy' ? 'none' : '1px solid #ccc',
                        padding: '10px',
                        cursor: 'pointer'
                    }}
                >
                    Buy
                </button>
                <button
                    onClick={() => handleActionSelect('sell')}
                    style={{
                        flex: 1,
                        marginLeft: '5px',
                        backgroundColor: action === 'sell' ? '#f44336' : '',
                        color: action === 'sell' ? 'white' : '',
                        border: action === 'sell' ? 'none' : '1px solid #ccc',
                        padding: '10px',
                        cursor: 'pointer'
                    }}
                >
                    Sell
                </button>
            </div>
            <input
                type="number"
                value={amount}
                onChange={handleAmountChange}
                placeholder="Enter amount"
                style={{width: '100%', padding: '10px', marginBottom: '10px', boxSizing: 'border-box'}}
            />
            <button
                onClick={handleTrade}
                disabled={isLoading}
                style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: isLoading ? '#cccccc' : '#007BFF',
                    color: 'white',
                    border: 'none',
                    cursor: isLoading ? 'not-allowed' : 'pointer'
                }}
            >
                {isLoading ? 'Processing...' : 'Trade'}
            </button>
            {error && <div style={{color: 'red', marginTop: '10px'}}>{error}</div>}
        </div>
    );
};

export default BuySellComponent;