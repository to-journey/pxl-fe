import { Box, Flex, Text } from "@chakra-ui/react";

const AboutUs = () => {
    return (
        <Flex justify='center'>
            <Box w='80%' mt={{ base: '32px', lg: '64px' }} p={{ base: '32px', lg: '64px' }} bg='#000c' fontSize={{ base: 12, lg: 20 }} rounded='xl'>
                <Text lineHeight={2}>
                    PXLGAMES is an exciting play-to-earn gaming platform that blends fun, competition, and rewards.
                </Text>
                <Text lineHeight={2}>
                    Our games, built on the $TLOS blockchain, offer players the chance to compete, farm points, and earn real rewards.
                </Text>
                <Text lineHeight={2}>
                    Whether you're answering crypto trivia in CRYPTALES, dodging the chaos in PUMP&DUMP, or tapping your way to victory in DIGITUS MAXIMUS, PXLGAMES brings you a diverse and engaging gaming experience.
                </Text>
                <Text lineHeight={2}>
                    With new games and features rolling out regularly, we are building a community-driven space where players can challenge themselves, climb leaderboards, and earn while they play.
                </Text>
                <Text lineHeight={2}>
                    Join the revolution and level up your gaming experience with PXLGAMES!
                </Text>
            </Box>
        </Flex>
    )
}

export default AboutUs;
