import { Box, Flex, Text } from "@chakra-ui/react";

const TermsOfService = () => {
  return (
    <Flex p={{ base: '16px', lg: '96px 96px 48px 96px' }} justify='center'>
      <Box w='full' maxW='1280px' p={{ base: '32px', lg: '64px' }} bg='#000c' fontSize={{ base: 12, lg: 20 }} rounded='xl'>
        <Flex direction='column' gap={2}>
          <Text textAlign='center' fontSize='large' fontWeight='bold'>
            Terms of Service
          </Text>
          <Flex direction='column' gap={1}>
            <Text fontWeight='bold'>
              1. Acceptance of Terms
            </Text>
            <Text whiteSpace='pre-wrap'>
              By accessing or using PXLGAMES, you agree to these Terms. If you do not agree, do not use our services.
            </Text>
          </Flex>

          <Flex direction='column' gap={1}>
            <Text fontWeight='bold'>
              2. User Responsibilities
            </Text>
            <Text whiteSpace='pre-wrap'>
              You must be at least 18 years old or meet your jurisdiction’s legal gaming age.
              Any form of cheating, exploiting, or manipulating game mechanics is strictly prohibited.
              Users are responsible for securing their accounts and wallets.
            </Text>
          </Flex>

          <Flex direction='column' gap={1}>
            <Text fontWeight='bold'>
              3. Game Mechanics & Rewards
            </Text>
            <Text whiteSpace='pre-wrap'>
              PXLGAMES offers mini-games with weekly leaderboards and reward distributions.
              Rewards are not guaranteed and are subject to change.
              PXLGAMES reserves the right to modify or remove rewards without notice.
            </Text>
          </Flex>

          <Flex direction='column' gap={1}>
            <Text fontWeight='bold'>
              4. Cheating & Account Termination
            </Text>
            <Text whiteSpace='pre-wrap'>
              If a user is found cheating (using bots, exploits, etc.), we reserve the right to terminate their account immediately.
              A terminated account loses all accumulated score points and will be permanently banned from leaderboards.
            </Text>
          </Flex>

          <Flex direction='column' gap={1}>
            <Text fontWeight='bold'>
              5. Partnerships & Blockchain Integration
            </Text>
            <Text whiteSpace='pre-wrap'>
              PXLGAMES is built on Telos.
              Any blockchain transactions (such as reward claims) are irreversible.
            </Text>
          </Flex>

          <Flex direction='column' gap={1}>
            <Text fontWeight='bold'>
              6. Prohibited Conduct
            </Text>
            <Text whiteSpace='pre-wrap'>
              Using automated scripts, bots, or any third-party software to manipulate the game.
              Harassment, abuse, or engaging in harmful activities against other users.
            </Text>
          </Flex>

          <Flex direction='column' gap={1}>
            <Text fontWeight='bold'>
              7. Termination
            </Text>
            <Text whiteSpace='pre-wrap'>
              PXLGAMES reserves the right to terminate accounts that violate these terms.
            </Text>
          </Flex>

          <Flex direction='column' gap={1}>
            <Text fontWeight='bold'>
              8. Disclaimer
            </Text>
            <Text whiteSpace='pre-wrap'>
              PXLGAMES provides services "as is" without warranties. We are not liable for lost funds, technical issues, or blockchain-related failures.
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}

export default TermsOfService;
