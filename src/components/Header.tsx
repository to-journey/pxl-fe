import { Box, Button, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Image, Text } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { useNavigate } from "react-router";
import { AuthContext } from "../providers/AuthProvider";
import Avatar from "./Avatar";
import { ListIcon } from "./icons";
import Profile from "./Profile";
import ScoreboardButton from "./ScoreboardButton";
import { useDynamicContext } from "@dynamic-labs/sdk-react-core";

const Header = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const { user: dynamicUser } = useDynamicContext();
    const [isOpenMenu, setIsOpenMenu] = useState(false);

    return (
        <>
            <Box position="sticky" top={0} zIndex={1020} w='full'>
                <Flex position='relative' h={{ base: '80px', lg: '112px' }} bg='#0008' px={{ base: '16px', lg: '96px' }} py='16px' gap={{ base: '16px', lg: '32px' }}>
                    <Image src="/logo.png" w={{ base: '48px', lg: '80px' }} h={{ base: '48px', lg: '80px' }} cursor='pointer' onClick={() => navigate('/')} />
                    <Flex w='full' align='center'>
                        <Flex display={{ base: 'none', lg: 'flex' }} align='center' gap='16px'>
                            <Button p='12px 28px 16px 28px' bg="black" fontSize={12} _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} onClick={() => navigate('/')}>
                                GAMES
                            </Button>
                            <ScoreboardButton onClick={() => setIsOpenMenu(false)} />
                            <Button p='12px 28px 16px 28px' bg="black" fontSize={12} _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} onClick={() => navigate('/about-us')}>
                                ABOUT US
                            </Button>
                            <Button p='12px 28px 16px 28px' bg="black" fontSize={12} _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} onClick={() => navigate('/partners')}>
                                PARTNERS
                            </Button>
                            {user?.is_admin && (
                                <Button p='12px 28px 16px 28px' bg="black" fontSize={12} _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} onClick={() => navigate('/admin')}>
                                    ADMIN PAGE
                                </Button>
                            )}
                        </Flex>
                        <Flex ml='auto' align='center' gap='8px'>
                            <Profile />
                            <Button display={{ lg: 'none' }} onClick={() => setIsOpenMenu(true)}>
                                <ListIcon />
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
                <Box h='6px' bg='#000' shadow='0 0 2px 2px #02d6e8' />
            </Box >
            <Drawer isOpen={isOpenMenu} onClose={() => setIsOpenMenu(false)}>
                <DrawerOverlay />
                <DrawerContent bg='#0008'>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        <Flex align='center' gap='8px'>
                            <Avatar w='48px' h='48px' src={`${import.meta.env.VITE_API_URL}/public/${user?.avatar}`} />
                            <Text fontSize={12}>{dynamicUser?.username}</Text>
                        </Flex>
                    </DrawerHeader>
                    <DrawerBody>
                        <Flex direction='column' gap={4}>
                            <Button p='12px 28px 16px 28px' bg="black" fontSize={12} onClick={() => {
                                navigate('/');
                                setIsOpenMenu(false);
                            }}>
                                GAMES
                            </Button>
                            <ScoreboardButton onClick={() => setIsOpenMenu(false)} />
                            <Button p='12px 28px 16px 28px' bg="black" fontSize={12} onClick={() => {
                                navigate('/about-us');
                                setIsOpenMenu(false);
                            }}>
                                ABOUT US
                            </Button>
                            {user?.is_admin && (
                                <Button p='12px 28px 16px 28px' bg="black" fontSize={12} onClick={() => {
                                    navigate('/admin');
                                    setIsOpenMenu(false);
                                }}>
                                    ADMIN PAGE
                                </Button>
                            )}
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    )
}

export default Header;
