import {useEffect, useState} from "react";
import {JettonMinterBC} from "../contracts/JettonMinterBC";
import {useTonClient} from "./useTonClient";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {Address, beginCell, OpenedContract, toNano} from "@ton/core";
import {useTonConnect} from "./useTonConnect.ts";
import {JettonWallet} from "../contracts/JettonWallet.ts";


export function useJettonWalletContract() {
    const client = useTonClient();
    const {sender, address} = useTonConnect();

    const [contractData, setContractData] = useState<null | {}>();

    const jettonMinterBC = useAsyncInitialize(async () => {
        if (!client) return;
        const contract = new JettonMinterBC(
            Address.parse("kQCpe4NHo7Ypm7LP17HR_jY-a2VLA3XDpZRzJQAa6_WGHZDK")
        );
        return client.open(contract) as OpenedContract<JettonMinterBC>;
    }, [client]);

    const userJettonWallet = useAsyncInitialize(async () => {
        if (client == null || address == null || jettonMinterBC == null) return;
        const jettonWalletAddress = await jettonMinterBC.getWalletAddress(address);
        const contract = JettonWallet.createFromAddress(jettonWalletAddress);
        return client.open(contract) as OpenedContract<JettonWallet>;
    }, [client, address, jettonMinterBC]);


    return {
        sellCoins: async (coinsAmount: string) => {
            if (userJettonWallet == null || jettonMinterBC == null) return;
            return userJettonWallet.sendTransfer(
                sender,
                toNano("0.1"),
                toNano(coinsAmount),
                jettonMinterBC.address,
                sender.address!!,
                beginCell().endCell(),
                toNano("0.03"),
                beginCell().endCell()
            );
        }
    };
}
