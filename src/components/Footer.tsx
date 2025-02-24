import { Box, Flex, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { SocialIcon } from "react-social-icons";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Flex position="sticky" bottom={0} direction="column" gap={2}>
      <Flex p="8px 32px" align="center" bg="black" color="white">
        <Flex flexGrow={1} fontFamily="Fauna Thin" gap={4}>
          <Text>
            @ 2025 PXLGAMES
          </Text>
          <Text >
            All rights reserved.
          </Text>
        </Flex>
        <Flex justify="center" gap={2}>
          <SocialIcon url="https://x.com/pxlgames_xyz" bgColor="#0000" fgColor="#fff" />
          <SocialIcon url="https://discord.gg/8djjQfZG3R" bgColor="#0000" fgColor="#fff" />
        </Flex>
        <Flex flexGrow={1} justify="right" fontFamily="Fauna Thin" gap={2}>
          <Text cursor='pointer' onClick={() => navigate('/terms-of-service')}>
            Terms Of Service
          </Text>
          <Box h='full' w='1px' bg='white' />
          <Text cursor='pointer' onClick={() => navigate('/privacy-policy')}>
            Privacy Policy
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Footer;
