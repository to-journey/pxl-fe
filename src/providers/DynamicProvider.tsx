import { EthereumWalletConnectors } from "@dynamic-labs/ethereum";
import { ProviderEnum } from '@dynamic-labs/sdk-api-core';
import { DynamicContextProvider, useSocialAccounts } from "@dynamic-labs/sdk-react-core";
import { FC, ReactNode, useContext, useEffect } from "react";
import { axios } from "../utils";
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

const SocialAccountHandler: FC = () => {
    const { getLinkedAccountInformation } = useSocialAccounts();

    useEffect(() => {
        const fetchLinkedAccounts = async () => {
            try {
                const twitterAccount = await getLinkedAccountInformation(ProviderEnum.Twitter);
                const telegramAccount = await getLinkedAccountInformation(ProviderEnum.Telegram);

                const res = await axios.get('/user-info');
                let user = res.data;

                if (telegramAccount) {
                    user.telegram_id = telegramAccount.publicIdentifier;
                    console.log(`Telegram account linked: ${telegramAccount.publicIdentifier}`);
                } else {
                    user.telegram_id = "";
                    console.log("No Telegram account linked.");
                }

                if (twitterAccount) {
                    user.twitter_id = twitterAccount.publicIdentifier;
                    console.log(`Twitter account linked: ${twitterAccount.publicIdentifier}`);
                } else {
                    user.twitter_id = "";
                    console.log("No Twitter account linked.");
                }

                await axios.put('/user-data', user);

            } catch (error) {
                console.error("Failed to fetch linked accounts:", error);
            }
        };

        fetchLinkedAccounts();
    }, [getLinkedAccountInformation]);

    return null;
};

const DynamicProvider: FC<{
    children: ReactNode;
}> = ({ children }) => {
    const { refresh, logout } = useContext(AuthContext);

    return (
        <DynamicContextProvider
            settings={{
                environmentId: "306c6c43-f376-4edd-94e0-80e640ba447e",
                mobileExperience: 'redirect',
                walletConnectors: [
                    EthereumWalletConnectors,
                ],
                events: {
                    onAuthSuccess: () => {

                        refresh?.();
                    },
                    onUserProfileUpdate: async (usr) => {

                        const res = await axios.get('/user-info');
                        let userData = res.data;

                        userData.name = usr?.username;

                        axios.put('/user-data', userData);
                    },
                    onLogout: () => {
                        logout?.();
                    },

                },
                overrides: {
                    evmNetworks,
                }
            }}
            theme="dark"
        >
            {children}
            <SocialAccountHandler />
        </DynamicContextProvider>
    );
}

export default DynamicProvider;
