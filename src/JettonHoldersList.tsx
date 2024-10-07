import React, {useEffect, useState, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {useHoldersList} from './hooks/useHoldersList';
import {useMinterBCContract} from './hooks/useJettonMinterBC';
import './JettonHoldersList.css';
import {JettonHolders} from "@ton-api/client";
import {Address, fromNano} from "@ton/core";

const JettonHoldersList: React.FC = () => {
    const {address} = useParams<{ address: string }>();
    const {getTop100HoldersList} = useHoldersList(address || "");
    const {totalSupply, bondingCurveAddress} = useMinterBCContract(address || "");
    const [holders, setHolders] = useState<JettonHolders | null>(null);

    const fetchHolders = useCallback(async () => {
        if (address) {
            const result = await getTop100HoldersList();
            if (result) {
                setHolders(result);
            }
        }
    }, [address, getTop100HoldersList]);

    useEffect(() => {
        fetchHolders();
    }, [fetchHolders]);

    console.log(`holders:${holders}:totalSupply:${totalSupply}:bondingCurveAddress:${bondingCurveAddress}`);
    if (!holders || totalSupply === undefined || bondingCurveAddress === undefined) {
        return <div className="jetton-holders-list">Loading holders...</div>;
    }

    const shortenAddress = (addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    };

    const calculatePercentage = (balance: string) => {
        if (totalSupply === 0n) return "0%";
        const balanceBigInt = BigInt(balance);
        return ((Number(fromNano(balanceBigInt)) / Number(fromNano(totalSupply))) * 100).toFixed(2) + "%";
    };

    const formatAddress = (holderAddress: Address) => {
        const addressString = holderAddress.toString();
        const shortened = shortenAddress(addressString);
        return bondingCurveAddress && addressString === bondingCurveAddress.toString()
            ? `${shortened} (bonding curve)`
            : shortened;
    };

    return (
        <div className="jetton-holders-list">
            <p className="total-holders">Total Holders: {holders.total}</p>
            <ul>
                {holders.addresses.map((holder, index) => (
                    <li key={index}>
                        <a
                            href={`https://testnet.tonviewer.com/${holder.address.toString()}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="address"
                        >
                            {formatAddress(holder.address)}
                        </a>
                        <span className="balance">{calculatePercentage(holder.balance)}</span>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default JettonHoldersList;