import {useEffect, useState} from "react";
import {JettonMinterBC} from "../contracts/JettonMinterBC";
import {useTonClient} from "./useTonClient";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {Address, OpenedContract, toNano} from "@ton/core";
import {useTonConnect} from "./useTonConnect.ts";


export function useMinterBCContract() {
    const client = useTonClient();
    const {sender, address} = useTonConnect();


    const [contractData, setContractData] = useState<null | {
        total_supply: bigint;
        admin_address: Address;
    }>();
    // const [balance, setBalance] = useState<null | number>(0);
    const jettonMinterBC = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new JettonMinterBC(
            Address.parse("kQCpe4NHo7Ypm7LP17HR_jY-a2VLA3XDpZRzJQAa6_WGHZDK")
        );
        return client.open(contract) as OpenedContract<JettonMinterBC>;
    }, [client]);

    const userJettonWalletAddress = useAsyncInitialize(async () => {
        if (address == null) return;
        return jettonMinterBC?.getWalletAddress(address);
    }, [address]);

    useEffect(() => {
        async function getValue() {
            if (!jettonMinterBC) return;
            setContractData(null);
            const val = await jettonMinterBC.getJettonData();
            setContractData({
                total_supply: val.totalSupply,
                admin_address: val.adminAddress,
            });
            // await sleep(5000);
            // getValue();
        }

        getValue();
    }, [jettonMinterBC]);


    return {
        contract_address: jettonMinterBC?.address.toString(),
        ...contractData,
        user_jetton_wallet: userJettonWalletAddress,
        getJettonWalletAddress: async (owner: Address) => {
            return jettonMinterBC?.getWalletAddress(owner);
        },
        buyCoins: async (tonAmount: string) => {
            return jettonMinterBC?.sendBuy(sender, toNano(tonAmount));
        }
    };
}
