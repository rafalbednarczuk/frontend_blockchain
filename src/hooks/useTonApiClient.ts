import {useAsyncInitialize} from './useAsyncInitialize';
import {Api, TonApiClient} from '@ton-api/client';

export function useTonApiClient() {
    return useAsyncInitialize(
        async () => {
            const http = new TonApiClient({
                baseUrl: 'https://tonapi.io',
                //TODO: switch to domain & IP restricted api key
                apiKey: 'AE4VKCTFFJ2Q5YYAAAAORBMHSCNQWDX4J5TH7MKLOQZ6YNG4SUL5GNQSOFKSXNHAD5D2IMQ'
            });
            return new Api(http);
        }
    );
}