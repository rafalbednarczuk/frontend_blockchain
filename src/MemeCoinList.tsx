import React, {useState, useEffect} from 'react';
import MemeCoinCard from './MemeCoinCard';
import {useCoinsList} from './hooks/useCoinsList';
import {Transaction} from "@ton-api/client";
import './MemeCoinList.css';

const MemeCoinList: React.FC = () => {
    const {getTop100HoldersList} = useCoinsList();
    const [transactions, setTransactions] = useState<Transaction[] | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const result = await getTop100HoldersList();
                setTransactions(result);
                setLoading(false);
            } catch (err) {
                setError('Failed to fetch transactions');
                setLoading(false);
            }
        };

        fetchTransactions();
    }, [getTop100HoldersList]);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!transactions) return <div>No transactions found</div>;

    const memeCoins = transactions
        .filter((tx: Transaction) => tx.outMsgs[0]?.destination?.address != null)
        .map((tx: Transaction, index: number) => ({
            address: tx.outMsgs[0]?.destination?.address?.toString() || '',
            name: `MemeCoin${index + 1}`,
            logo: `https://picsum.photos/200/200?random=${index + 1}`
        }));

    if (memeCoins.length === 0) return <div>No meme coins found</div>;

    return (
        <div className="memecoin-list">
            <h2>Meme Coins</h2>
            {memeCoins.map((coin) => (
                <MemeCoinCard key={coin.address} {...coin} />
            ))}
        </div>
    );
};

export default MemeCoinList;