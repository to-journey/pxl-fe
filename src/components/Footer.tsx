import { Box, Flex, Link, Text } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import DiscordIcon from "./icons/DiscordIcon";
import XIcon from "./icons/XIcon";

const Footer = () => {
  const navigate = useNavigate();

  return (
    <Flex position="sticky" bottom={0} direction="column" gap={2} fontFamily="Prima Sans">
      <Flex p={{ base: "16px 8px", lg: "32px" }} align="center" bg="black" color="white">
        <Flex flexGrow={1} direction={{ base: 'column', lg: 'row' }} gap={{ base: 1, lg: 2 }}>
          <Text>
            @ 2025 PXLGAMES
          </Text>
          <Text >
            All rights reserved
          </Text>
        </Flex>
        <Flex justify="center" gap={{ base: 2, lg: 8 }}>
          <Link w={6} h={6} color='white' href="https://x.com/pxlgames_xyz">
            <XIcon />
          </Link>
          <Link w={6} h={6} color='white' href="https://discord.gg/8djjQfZG3R">
            <DiscordIcon />
          </Link>
        </Flex>
        <Flex flexGrow={1} direction={{ base: 'column', lg: 'row' }} justify='right' gap={{ base: 1, lg: 2 }}>
          <Text textAlign='right' cursor='pointer' onClick={() => navigate('/terms-of-service')}>
            Terms Of Service
          </Text>
          <Box display={{ base: 'none', lg: 'block' }} h='full' w='1px' bg='white' />
          <Text textAlign='right' cursor='pointer' onClick={() => navigate('/privacy-policy')}>
            Privacy Policy
          </Text>
        </Flex>
      </Flex>
    </Flex>
  )
}

export default Footer;
