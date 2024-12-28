import { Flex } from '@chakra-ui/react';
import { DynamicEmbeddedWidget } from '@dynamic-labs/sdk-react-core';

const Wallet = () => {
    return (
        <Flex
            flexGrow={1}
            p={{ base: '16px', lg: '96px' }}
            justify="center"
            align="center"
        >
            <DynamicEmbeddedWidget background="with-border" />
        </Flex>
    );
}

export default Wallet;
