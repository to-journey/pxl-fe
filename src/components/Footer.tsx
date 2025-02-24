import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import DiscordIcon from "./icons/DiscordIcon";
import XIcon from "./icons/XIcon";

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
          <Link w={6} h={6} color='white' href="https://x.com/pxlgames_xyz">
            <XIcon />
          </Link>
          <Link w={6} h={6} color='white' href="https://discord.gg/8djjQfZG3R">
            <DiscordIcon />
          </Link>
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
