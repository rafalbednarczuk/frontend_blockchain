import {Address} from "@ton/core";
import {useTonApiClient} from "./useTonApiClient.ts";
import {useMemo, useCallback} from 'react';

export function useHoldersList(address: string) {
    const tonApiClient = useTonApiClient();

    const parsedAddress = useMemo(() => {
        try {
            return Address.parse(address);
        } catch (e) {
            return null;
        }
    }, [address]);

    const getTop100HoldersList = useCallback(() => {
        if (tonApiClient == null || parsedAddress == null) return null;
        return tonApiClient.jettons.getJettonHolders(parsedAddress, {limit: 100});
    }, [tonApiClient, parsedAddress]);

    return {
        getTop100HoldersList
    };
}
