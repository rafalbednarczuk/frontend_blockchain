import {useAsyncInitialize} from './useAsyncInitialize';
import {useTonApiClient} from "./useTonApiClient.ts";
import {ContractAdapter} from "@ton-api/ton-adapter";

export function useTonClient() {
    const tonApiClient = useTonApiClient();
    return useAsyncInitialize(
        async () => {
            if (tonApiClient == null) {
                return;
            }
            return new ContractAdapter(tonApiClient);
        },
        [tonApiClient]
    );
}