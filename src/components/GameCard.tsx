import { Box, Flex, Image, Link, Text } from "@chakra-ui/react";
import { FC } from "react";

interface Props {
    src: string;
    label: string;
    to?: string;
    isPlayed?: boolean;
}

const GameCard: FC<Props> = ({ src, label, to, isPlayed }) => {
    return (
        <Link href={to} display='flex' flexDirection='column' gap='8px' alignItems='center' _hover={{ border: 'none' }}>
            <Box position='relative' rounded='24px' overflow='hidden'>
                <Image src={src} />
                <Box position='absolute' w='full' h='full' top={0} transition='all' transitionDuration='200ms' _hover={{ transform: 'translate(0, -48px)' }}>
                    <Flex mt='100%' bg='#000c' h='48px' justify='center' align='center' rounded='24px'>
                        <Text mt='-4px'>
                            {to ? 'ENTER' : 'COMING SOON'}
                        </Text>
                    </Flex>
                </Box>
                {isPlayed && <Image src="/check.svg" position='absolute' left='50%' top='50%' transform='auto' translateX='-50%' translateY='-50%' bg='#fff2' border='2px solid white' rounded='full' />}
            </Box>
            <Text>
                {label}
            </Text>
        </Link>
    )
}

export default GameCard;
