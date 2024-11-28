import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { FC, ReactNode } from "react";

const theme = extendTheme({
    styles: {
        global: {
            body: {
                fontFamily: "'SF Slapstick Comic', sans-serif",
            },
        },
    },
});

interface Props {
    children: ReactNode;
}

const Provider: FC<Props> = ({ children }) => {
    return (
        <ChakraProvider theme={theme}>
            {children}
        </ChakraProvider>
    )
}

export default Provider;