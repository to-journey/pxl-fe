import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { BrowserRouter as Router } from "react-router";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./AuthProvider";
import DynamicProvider from "./DynamicProvider";

const theme = extendTheme({
    styles: {
        global: {
            body: {
                fontFamily: "'Pixeled', sans-serif",
                fontSize: 12,
            },
        },
    },
});

export const queryClient = new QueryClient();

interface Props {
    children: ReactNode;
}

const Provider: FC<Props> = ({ children }) => {
    return (
        <QueryClientProvider client={queryClient}>
            <ToastContainer />
            <ChakraProvider theme={theme}>
                <Router>
                    <AuthProvider>
                        <DynamicProvider>
                            {children}
                        </DynamicProvider>
                    </AuthProvider>
                </Router>
            </ChakraProvider>
        </QueryClientProvider>
    )
}

export default Provider;
