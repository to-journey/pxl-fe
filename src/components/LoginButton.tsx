import { Box, BoxProps } from "@chakra-ui/react";
import { DynamicConnectButton } from "@dynamic-labs/sdk-react-core";
import { FC } from "react";

const LoginButton: FC<BoxProps> = ({ ...props }) => {
    return (
        <Box {...props}>
            <DynamicConnectButton>
                <Box
                    textAlign='center'
                    bgGradient='linear(to-r, #0cdee4, #b100fe)'
                    p='8px 20px'
                    borderRadius='full'
                    fontSize='small'
                    transition='all 0.3s ease'
                    cursor='pointer'
                    _hover={{
                        boxShadow: '0 10px 15px -3px rgba(255, 255, 255, 0.25), 0 4px 6px -2px rgba(255, 255, 255, 0.25)'
                    }}
                >
                    LOGIN
                </Box>
            </DynamicConnectButton>
        </Box>
    )
}

export default LoginButton;
