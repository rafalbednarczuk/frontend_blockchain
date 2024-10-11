import {useEffect, useState, useCallback} from "react";
import {JettonMinterBC} from "../contracts/JettonMinterBC";
import {useTonClient} from "./useTonClient";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {Address, OpenedContract, toNano} from "@ton/core";
import {useTonConnect} from "./useTonConnect";

export function useMinterBCContract(address: string) {
    const client = useTonClient();
    const {sender} = useTonConnect();
    const [contractData, setContractData] = useState<null | {
        totalSupply: bigint;
        bondingCurveAddress: Address,
    }>();

    const minterBCContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new JettonMinterBC(
            Address.parse(address)
        );
        return client.open(contract) as OpenedContract<JettonMinterBC>;
    }, [client, address]);

    useEffect(() => {
        async function getValue() {
            if (!minterBCContract) return;
            const totalSupply = await minterBCContract.getTotalSupply();
            const bondingCurveAddress = await minterBCContract.getWalletAddress(minterBCContract.address);
            setContractData({
                totalSupply: totalSupply,
                bondingCurveAddress: bondingCurveAddress,
            });
        }

        getValue();
    }, [minterBCContract]);

    const getJettonWalletAddress = useCallback(async (ownerAddress: string) => {
        if (!minterBCContract) return null;
        console.log(`getJettonWalletAddress called for: ${ownerAddress}`);
        return minterBCContract.getWalletAddress(Address.parse(ownerAddress));
    }, [minterBCContract]);

    const buyCoins = useCallback((amount: string) => {
        return minterBCContract?.sendBuy(sender, toNano(amount));
    }, [minterBCContract, sender]);

    return {
        ...contractData,
        minterBCContract,
        minterAddress: minterBCContract?.address.toString(),
        buyCoins,
        getJettonWalletAddress,
    };
}