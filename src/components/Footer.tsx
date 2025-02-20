import { Box, Flex, Text } from "@chakra-ui/react";
import { SocialIcon } from "react-social-icons";

const Footer = () => {
  return (
    <Flex position="sticky" bottom={0} direction="column" gap={2}>
      <Flex justify="center" gap={4}>
        <SocialIcon url="https://x.com/pxlgames_xyz" bgColor="#0000" fgColor="#222" />
        <SocialIcon url="https://discord.gg/8djjQfZG3R" bgColor="#0000" fgColor="#222" />
      </Flex>
      <Flex p="32px 16px 16px 16px" justify="space-between" bg="black" color="white">
        <Flex gap={4}>
          <Text fontFamily="Prima Sans">
            @ 2025 PXLGAMES
          </Text>
          <Text fontFamily="Fauna Thin" >
            All rights reserved.
          </Text>
        </Flex>
        <Flex fontFamily="Fauna Thin" gap={2}>
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
