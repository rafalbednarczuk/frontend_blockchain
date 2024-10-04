import {useEffect, useState} from "react";
import {JettonMinterBC} from "../contracts/JettonMinterBC";
import {useTonClient} from "./useTonClient";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {Address, OpenedContract, toNano} from "@ton/core";
import {useTonConnect} from "./useTonConnect.ts";

export function useMinterBCContract() {
    const client = useTonClient();
    const {sender} = useTonConnect();
    const [contractData, setContractData] = useState<null | {
        totalSupply: bigint;
    }>();

    const minterBCContract = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new JettonMinterBC(
            Address.parse("kQBf7lKe67XXtKMd696fCBVArmUACR5kjsGDQ5wudZ1Q2ZXs") // DUPCoin 15
        );
        return client.open(contract) as OpenedContract<JettonMinterBC>;
    }, [client]);

    useEffect(() => {
        async function getValue() {
            if (!minterBCContract) return;
            setContractData(null);
            const totalSupply = await minterBCContract.getTotalSupply();
            setContractData({
                totalSupply: totalSupply,
            });
        }

        getValue();
    }, [minterBCContract]);

    return {
        minterAddress: minterBCContract?.address.toString(),
        ...contractData,
        buyCoins: () => {
            return minterBCContract?.sendBuy(sender, toNano("0.1"));
        },
    };
}

