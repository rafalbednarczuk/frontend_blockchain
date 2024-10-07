import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {useHoldersList} from './hooks/useHoldersList';
import './JettonHoldersList.css';
import {JettonHolders} from "@ton-api/client";
import {fromNano} from "@ton/core";

const JettonHoldersList: React.FC = () => {
    const {address} = useParams<{ address: string }>();
    const {getTop100HoldersList} = useHoldersList(address || "");
    const [holders, setHolders] = useState<JettonHolders | null>(null);

    useEffect(() => {
        const fetchHolders = async () => {
            if (address) {
                const result = await getTop100HoldersList();
                if (result) {
                    setHolders(result);
                }
            }
        };
        fetchHolders();
    }, [address, getTop100HoldersList]);

    if (!holders) {
        return <div className="jetton-holders-list">Loading holders...</div>;
    }

    return (
        <div className="jetton-holders-list">
            <p className="total-holders">Total Holders: {holders.total}</p>
            <ul>
                {holders.addresses.map((holder, index) => (
                    <li key={index}>
                        <span className="address">{holder.address.toString()}</span>
                        <span className="balance">{fromNano(holder.balance)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JettonHoldersList;