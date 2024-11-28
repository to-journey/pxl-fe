import { Box, Button, Flex, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router";

const Header = () => {
    const navigate = useNavigate();

    return (
        <Box position="fixed" top={0} w='full'>
            <Flex position='relative' h='96px' bgGradient='linear(to-r, teal.800, teal.500)' px='96px' py='16px' gap='32px'>
                <Image src="/logo.png" />
                <Flex w='full' justify='space-between'>
                    <Flex align='center' gap='16px'>
                        <Button w='160px' bg="#222">
                            GAMES
                        </Button>
                        <Button w='160px' bg="#222" onClick={() => navigate('/scoreboard')}>
                            SCOREBOARD
                        </Button>
                        <Button w='160px' bg="#222" onClick={() => navigate('/about-us')}>
                            ABOUT US
                        </Button>
                    </Flex>
                    <Flex align='center'>
                        <Button w='160px' bg="#222">
                            SIGN IN
                        </Button>
                    </Flex>
                </Flex>
                <Box position='absolute' left={0} bottom={0} w='full' h='6px' bgGradient='linear(to-b, #0000, teal.400)' />
            </Flex>
            <Box h='6px' bgGradient='linear(to-b, teal.800, teal.500, teal.700)' />
        </Box>
    )
}

export default Header;
