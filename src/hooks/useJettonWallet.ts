import {JettonMinterBC} from "../contracts/JettonMinterBC";
import {useTonClient} from "./useTonClient";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {Address, beginCell, OpenedContract, toNano} from "@ton/core";
import {useTonConnect} from "./useTonConnect.ts";
import {useMinterBCContract} from "./useJettonMinterBC.ts";
import {JettonWallet} from "../contracts/JettonWallet.ts";
import {useTonAddress} from "@tonconnect/ui-react";

export function useJettonWalletContract() {
    const client = useTonClient();
    const {sender} = useTonConnect();
    const {minterBCContract} = useMinterBCContract()
    const userAddress = useTonAddress();

    const walletContract = useAsyncInitialize(async () => {
        console.log(`sender address:${userAddress}`);
        if (client == null || minterBCContract == null || userAddress == null || userAddress == "") return;
        const walletAddress = await minterBCContract.getWalletAddress(Address.parse(userAddress));
        const contract = new JettonWallet(walletAddress);
        return client.open(contract) as OpenedContract<JettonWallet>;
    }, [client, minterBCContract, userAddress]);


    return {
        minterAddress: minterBCContract?.address.toString(),
        sellCoins: () => {
            if (walletContract == null || minterBCContract == null) return;
            return walletContract.sendTransfer(sender,
                toNano("0.1"),
                toNano("1000"),
                minterBCContract.address,
                sender.address!!,
                beginCell().endCell(),
                //Forward amount have to be higher than 1 nano TON, otherwise the message isn't going to be delivered as no gas
                //Otherwise. Skipped: true, Skip reason: cskip_no_gas
                toNano("0.03"),
                beginCell().endCell(),
            );
        },
    };
}

