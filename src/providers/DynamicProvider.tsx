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

const DynamicProvider: FC<{
    children: ReactNode;
}> = ({ children }) => {
    const { refresh, logout } = useContext(AuthContext);

    return (
        <DynamicContextProvider
            settings={{
                environmentId: "ce082cc7-f0b7-4427-8cbf-300cb553cf93",
                mobileExperience: 'redirect',
                walletConnectors: [
                    EthereumWalletConnectors,
                ],
                events: {
                    onAuthSuccess: () => {
                        refresh?.();
                    },
                    onLogout: () => {
                        logout?.();
                    }
                },
                overrides: {
                    evmNetworks,
                }
            }}
            theme="dark"
        >
            {children}
        </DynamicContextProvider>
    );
}

export default DynamicProvider;
