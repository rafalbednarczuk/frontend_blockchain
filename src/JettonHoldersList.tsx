import React, {useEffect, useState, useCallback, useMemo, useRef} from 'react';
import {useParams} from 'react-router-dom';
import {useHoldersList} from './hooks/useHoldersList';
import {useTonAddress} from '@tonconnect/ui-react';
import './JettonHoldersList.css';
import {JettonHolders} from "@ton-api/client";
import {Address, fromNano} from "@ton/core";

interface JettonHoldersListProps {
    totalSupply: bigint | undefined;
    bondingCurveAddress: Address | undefined;
    userJettonWalletAddress: Address | null;
}

const JettonHoldersList: React.FC<JettonHoldersListProps> = ({ totalSupply, bondingCurveAddress, userJettonWalletAddress }) => {
    const {address} = useParams<{ address: string }>();
    const {getTop100HoldersList} = useHoldersList(address || "");
    const [holders, setHolders] = useState<JettonHolders | null>(null);

    const fetchingHolders = useRef(false);

    const fetchHolders = useCallback(async () => {
        if (fetchingHolders.current || !address) return;
        fetchingHolders.current = true;
        try {
            const result = await getTop100HoldersList();
            if (result) {
                setHolders(result);
            }
        } catch (error) {
            console.error('Error fetching holders:', error);
        } finally {
            fetchingHolders.current = false;
        }
    }, [address, getTop100HoldersList]);

    useEffect(() => {
        fetchHolders();
    }, [fetchHolders]);



    const shortenAddress = useCallback((addr: string) => {
        return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
    }, []);

    const calculatePercentage = useCallback((balance: string) => {
        if (totalSupply === undefined || totalSupply === 0n) return "0%";
        const balanceBigInt = BigInt(balance);
        return ((Number(fromNano(balanceBigInt)) / Number(fromNano(totalSupply))) * 100).toFixed(2) + "%";
    }, [totalSupply]);

    const formatAddress = useCallback((holderAddress: Address) => {
        const addressString = holderAddress.toString();
        const shortened = shortenAddress(addressString);
        let label = '';

        if (bondingCurveAddress && addressString === bondingCurveAddress.toString()) {
            label += ' (Bonding Curve)';
        }

        if (userJettonWalletAddress && addressString === userJettonWalletAddress.toString()) {
            label += ' (You)';
        }

        return shortened + label;
    }, [shortenAddress, bondingCurveAddress, userJettonWalletAddress]);

    const renderedHolders = useMemo(() => {
        if (!holders) return null;
        return holders.addresses.map((holder, index) => (
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
        ));
    }, [holders, formatAddress, calculatePercentage]);

    if (!holders || totalSupply === undefined || bondingCurveAddress === undefined) {
        return <div className="jetton-holders-list">Loading holders...</div>;
    }

    return (
        <div className="jetton-holders-list">
            <p className="total-holders">Total Holders: {holders.total}</p>
            <ul>{renderedHolders}</ul>
        </div>
    );
};

export default JettonHoldersList;