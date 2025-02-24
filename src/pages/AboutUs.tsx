import { Box, Flex, Text } from "@chakra-ui/react";

const AboutUs = () => {
  return (
    <Flex p={{ base: '16px', lg: '96px' }} justify='center' fontFamily="Prima Sans">
      <Box w='full' maxW='1280px' p={{ base: '32px', lg: '64px' }} bg='#000c' fontSize={{ base: 12, lg: 20 }} rounded='xl'>
        <Flex direction='column' gap={2}>
          <Text textAlign='center' fontSize='large' fontWeight='bold'>
            About US
          </Text>
          <Flex direction='column' gap={1}>
            <Text>
              PXLGAMES is an exciting play-to-earn gaming platform that blends fun, competition, and rewards.
            </Text>
            <Text>
              Our games, built on the $TLOS blockchain, offer players the chance to compete, farm points, and earn real rewards.
            </Text>
            <Text>
              Whether you're answering crypto trivia in CRYPTALES, dodging the chaos in PUMP&DUMP, or tapping your way to victory in DIGITUS MAXIMUS, PXLGAMES brings you a diverse and engaging gaming experience.
            </Text>
            <Text>
              With new games and features rolling out regularly, we are building a community-driven space where players can challenge themselves, climb leaderboards, and earn while they play.
            </Text>
            <Text>
              Join the revolution and level up your gaming experience with PXLGAMES!
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}

export default AboutUs;
