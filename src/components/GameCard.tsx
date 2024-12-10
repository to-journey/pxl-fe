import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { FC, useContext } from "react";
import { toast } from "react-toastify";
import { AuthContext } from "../providers/AuthProvider";

interface Props {
    src: string;
    label: string;
    to?: string;
    isPlayed?: boolean;
}

const GameCard: FC<Props> = ({ src, label, to, isPlayed }) => {
    const { user } = useContext(AuthContext);

    return (
        <Box display='flex' flexDirection='column' gap='8px' alignItems='center' cursor='pointer' _hover={{ border: 'none' }} onClick={() => {
            if (!user) {
                toast.error('Please login to play the game.');
            } else if (!user.avatar || user.avatar.trim().length == 0) {
                toast.error('Please upload your avatar to play the game.');
            } else if (user.telegram_id.length == 0) {
                toast.error('Please connect your Telegram account to play the game.');
            } else if (to) {
                window.location.href = to;
            }
        }}>
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
        </Box >
    )
}

export default GameCard;
