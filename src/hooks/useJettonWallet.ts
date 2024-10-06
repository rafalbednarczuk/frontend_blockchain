import {JettonMinterBC} from "../contracts/JettonMinterBC";
import {useTonClient} from "./useTonClient";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {Address, beginCell, OpenedContract, toNano} from "@ton/core";
import {useTonConnect} from "./useTonConnect.ts";
import {useMinterBCContract} from "./useJettonMinterBC.ts";
import {JettonWallet} from "../contracts/JettonWallet.ts";
import {useTonAddress} from "@tonconnect/ui-react";

export function useJettonWalletContract(address: string) {
    const client = useTonClient();
    const {sender} = useTonConnect();
    const {minterBCContract} = useMinterBCContract(address)
    const userAddress = useTonAddress();

    const walletContract = useAsyncInitialize(async () => {
        if (client == null || minterBCContract == null || userAddress == null || userAddress == "") return;
        const walletAddress = await minterBCContract.getWalletAddress(Address.parse(userAddress));
        const contract = new JettonWallet(walletAddress);
        return client.open(contract) as OpenedContract<JettonWallet>;
    }, [client, minterBCContract, userAddress]);


    return {
        minterAddress: minterBCContract?.address.toString(),
        sellCoins: (amount: string) => {
            if (walletContract == null || minterBCContract == null || sender.address == undefined) return;
            return walletContract.sendSellJettons(sender,
                toNano("0.1"),
                toNano(amount),
                minterBCContract.address,
            );
        },
    };
}