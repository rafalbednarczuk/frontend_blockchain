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
            Address.parse("kQAs18GaQer47k2tDbL_CCQqOq5roicZPOkvbj6LBUuuohKb") // DUPCoin 23
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
        minterBCContract,
        minterAddress: minterBCContract?.address.toString(),
        ...contractData,
        buyCoins: () => {
            return minterBCContract?.sendBuy(sender, toNano("0.3"));
        },
    };
}

