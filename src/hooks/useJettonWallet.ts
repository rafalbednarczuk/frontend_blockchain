import {useTonClient} from "./useTonClient";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {Address, beginCell, OpenedContract, toNano} from "@ton/core";
import {useTonConnect} from "./useTonConnect.ts";
import {JettonWallet} from "../contracts/JettonWallet.ts";

export function useJettonWalletContract(minterAddress: string | null, address: string | null) {
    const client = useTonClient();
    const {sender} = useTonConnect();

    const walletContract = useAsyncInitialize(async () => {
        if (client == null || address == null || address == "") return;
        const contract = new JettonWallet(Address.parse(address));
        return client.open(contract) as OpenedContract<JettonWallet>;
    }, [client]);


    return {
        sellCoins: (amount: string) => {
            if (walletContract == null || sender.address == undefined || minterAddress == null || minterAddress == "") return;
            return walletContract.sendSellJettons(sender,
                toNano("0.1"),
                toNano(amount),
                Address.parse(minterAddress!!),
            );
        },
        getJettonBalance: () => {
            if (walletContract == null || sender.address == undefined) return;
            return walletContract.getJettonBalance();
        }
    };
}