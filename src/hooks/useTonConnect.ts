import {useTonAddress, useTonConnectUI} from '@tonconnect/ui-react';
import {Address, Sender, SenderArguments} from '@ton/core';

export function useTonConnect(): { sender: Sender; connected: boolean } {
    const [tonConnectUI] = useTonConnectUI();
    const userAddress = useTonAddress();

    return {
        sender: {
            send: async (args: SenderArguments) => {
                await tonConnectUI.sendTransaction({
                    messages: [
                        {
                            address: args.to.toString(),
                            amount: args.value.toString(),
                            payload: args.body?.toBoc().toString('base64'),
                        },
                    ],
                    validUntil: Date.now() + 5 * 60 * 1000, // 5 minutes for user to approve
                });
            },
            address: userAddress == "" ? undefined : Address.parse(userAddress),
        },
        connected: tonConnectUI.connected,
    };
}