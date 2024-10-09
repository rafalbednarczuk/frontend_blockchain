import {Address} from "@ton/core";
import {useTonApiClient} from "./useTonApiClient.ts";
import {useMemo, useCallback} from 'react';

export function useJettonMetadata(address: string) {
    const tonApiClient = useTonApiClient();

    const parsedAddress = useMemo(() => {
        try {
            return Address.parse(address);
        } catch (e) {
            return null;
        }
    }, [address]);

    const getJsonMetadata = useCallback(async () => {
        if (tonApiClient == null || parsedAddress == null) return null;
        const jettonMetadata = await tonApiClient.jettons.getJettonInfo(parsedAddress);
        return jettonMetadata.metadata;
    }, [tonApiClient, parsedAddress]);

    return {
        getJsonMetadata
    };
}
