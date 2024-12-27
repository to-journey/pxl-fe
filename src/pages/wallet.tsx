import { Flex } from '@chakra-ui/react';
import { DynamicEmbeddedWidget } from '@dynamic-labs/sdk-react-core';

const Wallet = () => {
    return (
        <>
            <Flex
                p={{ base: '16px', lg: '96px' }}
                justify="center"
                align="center"
                minH="100vh" // Ensures the widget is vertically centered
            >
                <Flex w="full" maxW="1280px" justify="center">
                    <DynamicEmbeddedWidget background="with-border" />
                </Flex>
            </Flex>
        </>
    );
}

export default Wallet;
