import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { DynamicContextProvider } from "@dynamic-labs/sdk-react-core";
import { FC, ReactNode, useContext } from "react";
import { AuthContext } from "./AuthProvider";

const evmNetworks = [
    {
        blockExplorerUrls: ["https://www.teloscan.io/"],
        chainId: 40,
        chainName: "Telos",
        iconUrls: ['https://raw.githubusercontent.com/telosnetwork/token-list/main/logos/telos.png'],
        name: 'Telos',
        nativeCurrency: {
            name: "Telos",
            symbol: "TLOS",
            decimals: 18,
            iconUrl: 'https://raw.githubusercontent.com/telosnetwork/token-list/main/logos/telos.png',
        },
        networkId: 40,
        rpcUrls: ["https://rpc.telos.net/"],
        vanityName: 'Telos EVM Mainnet',
    },
];

const WalletConnectProvider: FC<{
    children: ReactNode;
}> = ({ children }) => {
    const { signInWithDynamicId, logout } = useContext(AuthContext);

    return (
        <DynamicContextProvider
            settings={{
                environmentId: "ce082cc7-f0b7-4427-8cbf-300cb553cf93",
                walletConnectors: [
                    EthereumWalletConnectors,
                ],
                events: {
                    onAuthSuccess: (args) => {
                        if (args.user.userId) {
                            signInWithDynamicId?.(args.user.userId);
                        }
                    },
                    onLogout: () => {
                        logout?.();
                    }
                },
                overrides: {
                    evmNetworks,
                }
            }}
        >
            {children}
        </DynamicContextProvider>
    );
}

export default WalletConnectProvider;
