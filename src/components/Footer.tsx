import { Box, Flex, Text } from "@chakra-ui/react";
import { SocialIcon } from "react-social-icons";

const Footer = () => {
  return (
    <Flex position="sticky" bottom={0} direction="column" gap={2}>
      <Flex p="24px" align="center" bg="black" color="white">
        <Flex flexGrow={1} fontFamily="Fauna Thin" gap={4}>
          <Text>
            @ 2025 PXLGAMES
          </Text>
          <Text >
            All rights reserved.
          </Text>
        </Flex>
        <Flex justify="center" gap={4}>
          <SocialIcon url="https://x.com/pxlgames_xyz" bgColor="#0000" fgColor="#f0f" />
          <SocialIcon url="https://discord.gg/8djjQfZG3R" bgColor="#0000" fgColor="#f0f" />
        </Flex>
        <Flex flexGrow={1} fontFamily="Fauna Thin" gap={2}>
          <Text>
            Terms Of Service
          </Text>
          <Box h='full' w='1px' bg='white' />
          <Text>
            Privacy Policy
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Footer;
