import {Address, OpenedContract} from "@ton/core";
import {useTonApiClient} from "./useTonApiClient.ts";
import {useMemo, useCallback} from 'react';
import {CoinLauncher} from "../contracts/CoinLauncher.ts";

export function useCoinsList() {
    const tonApiClient = useTonApiClient();


    const getLastCoinsCreated = useCallback(async () => {
        if (tonApiClient == null) return null;
        const coinLauncherAddress = Address.parse("EQAkEBhKCivwdHhNkEoJaYN8MWOzAPNr6HcWrW7nsPXooFRP");
        const transactions = await tonApiClient.blockchain.getBlockchainAccountTransactions(coinLauncherAddress);
        return transactions.transactions
    }, [tonApiClient]);

    return {
        getTop100HoldersList: getLastCoinsCreated
    };
}
