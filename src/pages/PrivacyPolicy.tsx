import { Box, Flex, Text } from "@chakra-ui/react";

const PrivacyPolicy = () => {
  return (
    <Flex p={{ base: '16px', lg: '96px' }} justify='center' fontFamily="Prima Sans">
      <Box w='full' maxW='1280px' p={{ base: '32px', lg: '64px' }} bg='#000c' fontSize={{ base: 12, lg: 20 }} rounded='xl'>
        <Flex direction='column' gap={2}>
          <Flex direction='column' gap={1}>
            <Text textAlign='center' fontSize='large' fontWeight='bold'>
              Privacy Policy
            </Text>

            <Flex direction='column' gap={1}>
              <Text fontWeight='bold'>
                1. Information We Collect
              </Text>
              <Text whiteSpace='pre-wrap'>
                Account Data: Username, email (if applicable), and connected wallet addresses.
                Gameplay Data: Scores, rankings, and activity history.
                Blockchain Transactions: We log transactions for leaderboard and reward distribution.
              </Text>
            </Flex>

            <Flex direction='column' gap={1}>
              <Text fontWeight='bold'>
                2. How We Use Your Information
              </Text>
              <Text whiteSpace='pre-wrap'>
                To operate and improve PXLGAMES services.
                To track leaderboards and distribute rewards.
                To provide a social gaming experience, including SocialFi elements where users can share activities.
              </Text>
            </Flex>

            <Flex direction='column' gap={1}>
              <Text fontWeight='bold'>
                3. Third-Party Services
              </Text>
              <Text whiteSpace='pre-wrap'>
                PXLGAMES may use third-party partners (such as Telos & Tekika) for blockchain transactions and authentication.
                Your wallet interactions are governed by the blockchain’s own policies.
              </Text>
            </Flex>

            <Flex direction='column' gap={1}>
              <Text fontWeight='bold'>
                4. Security
              </Text>
              <Text whiteSpace='pre-wrap'>
                We prioritize user data protection but cannot guarantee complete security over blockchain transactions.
                Users are responsible for securing their wallets.
              </Text>
            </Flex>

            <Flex direction='column' gap={1}>
              <Text fontWeight='bold'>
                5. User Rights
              </Text>
              <Text whiteSpace='pre-wrap'>
                You can request deletion of your account data (excluding blockchain records).
                PXLGAMES does not sell personal data to third parties.
              </Text>
            </Flex>

            <Flex direction='column' gap={1}>
              <Text fontWeight='bold'>
                6. Policy Updates
              </Text>
              <Text whiteSpace='pre-wrap'>
                These policies may be updated, and continued use of PXLGAMES constitutes acceptance of any modifications.
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
    </Flex>
  )
}

export default PrivacyPolicy;
