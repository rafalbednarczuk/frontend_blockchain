import {Address} from "@ton/core";
import {useTonApiClient} from "./useTonApiClient.ts";

export function useHoldersList(address: string) {
    const tonApiClient = useTonApiClient();

    return {
        getTop100HoldersList: () => {
            if (tonApiClient == null) return;
            return tonApiClient.jettons.getJettonHolders(Address.parse(address), {limit: 100});
        },
    };
}