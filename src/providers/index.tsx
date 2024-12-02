import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { FC, ReactNode } from "react";
import { BrowserRouter as Router } from "react-router";
import { ToastContainer } from "react-toastify";
import AuthProvider from "./AuthProvider";

const theme = extendTheme({
    styles: {
        global: {
            body: {
                fontFamily: "'SF Slapstick Comic', sans-serif",
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
                        {children}
                    </AuthProvider>
                </Router>
            </ChakraProvider>
        </QueryClientProvider>
    )
}

export default Provider;
