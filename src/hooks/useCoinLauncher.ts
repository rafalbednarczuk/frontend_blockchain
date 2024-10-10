import {useTonClient} from "./useTonClient";
import {useAsyncInitialize} from "./useAsyncInitialize";
import {Address, beginCell, OpenedContract, toNano} from "@ton/core";
import {useTonConnect} from "./useTonConnect.ts";
import {CoinLauncher, jettonContentToCell} from "../contracts/CoinLauncher.ts";


export function useCoinLauncherContract(address: string) {
    const client = useTonClient();
    const {sender} = useTonConnect();

    const coinLauncherContract = useAsyncInitialize(async () => {
        if (client == null) return;
        const coinLauncherAddress = "EQAkEBhKCivwdHhNkEoJaYN8MWOzAPNr6HcWrW7nsPXooFRP";
        const contract = new CoinLauncher(Address.parse(coinLauncherAddress));
        return client.open(contract) as OpenedContract<CoinLauncher>;
    }, [client]);


    return {
        launchJetton: (amount: string, contentUrl: string) => {
            if (coinLauncherContract == null || sender.address == undefined) return;
            const content = jettonContentToCell({type: 1, uri: contentUrl});
            return coinLauncherContract.sendLaunchJetton(
                sender,
                content,
                toNano(amount),
            );
        },
    };
}