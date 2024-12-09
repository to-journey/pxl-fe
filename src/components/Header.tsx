import { Avatar, Box, Button, ButtonGroup, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text, Tooltip } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { useUpdateUser } from "../api/users";
import { AuthContext } from "../providers/AuthProvider";
import { ListIcon } from "./icons";
import Profile from "./Profile";
import ScoreboardButton from "./ScoreboardButton";

const Header = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isOpenProfileEditModal, setIsOpenProfileEditModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [image, setImage] = useState<File>();
    const [avatar, setAvatar] = useState<string>();
    const [name, setName] = useState('');
    const [telegramId, setTelegramId] = useState('');
    const { mutate: handleUpdateUserInfo } = useUpdateUser();

    const handleSave = () => {
        const formData = new FormData();
        if (image)
            formData.append('image', image);
        formData.append('name', name);
        formData.append('telegram_id', telegramId);
        handleUpdateUserInfo(formData);
    }

    useEffect(() => {
        if (user?.name) setName(user.name);
        if (user?.telegram_id) setTelegramId(user.telegram_id);
        if (user?.avatar) setAvatar(`${import.meta.env.VITE_API_URL}/public/${user.avatar}`);
    }, [user]);

    return (
        <>
            <Input ref={fileInputRef} type="file" accept="image/*" display='none' onChange={(e) => {
                const image = e.target.files?.[0];
                if (image)
                    setAvatar(URL.createObjectURL(image));
                setImage(image);
            }} />
            <Box position="fixed" top={0} zIndex={1020} w='full'>
                <Flex position='relative' h={{ base: '80px', lg: '112px' }} bg='#0008' px={{ base: '16px', lg: '96px' }} py='16px' gap={{ base: '16px', lg: '32px' }}>
                    <Image src="/logo.png" w={{ base: '48px', lg: '80px' }} h={{ base: '48px', lg: '80px' }} cursor='pointer' onClick={() => navigate('/')} />
                    <Flex w='full' align='center'>
                        <Flex display={{ base: 'none', lg: 'flex' }} align='center' gap='16px'>
                            <Button p='12px 28px 16px 28px' bg="black" fontSize={12} _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} onClick={() => navigate('/')}>
                                GAMES
                            </Button>
                            <ScoreboardButton onWeeklyClick={() => navigate('/scoreboard?view=weekly')} onTotalClick={() => navigate('/scoreboard?view=total')} />
                            <Button p='12px 28px 16px 28px' bg="black" fontSize={12} _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} onClick={() => navigate('/about-us')}>
                                ABOUT US
                            </Button>
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
                        <Profile />
                    </DrawerHeader>
                    <DrawerBody>
                        <Flex direction='column' gap={4}>
                            <Button p='12px 28px 16px 28px' bg="black" fontSize={12} onClick={() => {
                                navigate('/');
                                setIsOpenMenu(false);
                            }}>
                                GAMES
                            </Button>
                            <ScoreboardButton
                                onWeeklyClick={() => {
                                    navigate('/scoreboard?view=weekly');
                                    setIsOpenMenu(false);
                                }}
                                onTotalClick={() => {
                                    navigate('/scoreboard?view=total');
                                    setIsOpenMenu(false);
                                }}
                            />
                            <Button p='12px 28px 16px 28px' bg="black" fontSize={12} onClick={() => {
                                navigate('/about-us');
                                setIsOpenMenu(false);
                            }}>
                                ABOUT US
                            </Button>
                        </Flex>
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
            <Modal size='xs' isCentered isOpen={isOpenProfileEditModal} onClose={() => setIsOpenProfileEditModal(false)}>
                <ModalOverlay />
                <ModalContent bg='#000c'>
                    <ModalCloseButton />
                    <ModalHeader pb='8px'>
                        EDIT PROFILE
                    </ModalHeader>
                    <ModalBody>
                        <Flex direction='column' gap='16px'>
                            <Flex justify='center'>
                                <Avatar src={avatar} cursor='pointer' size='lg' onClick={() => fileInputRef.current?.click()} />
                            </Flex>
                            <Flex direction='column' gap='8px'>
                                <Text>USER NAME:</Text>
                                <Input fontSize={14} value={name} onChange={(e) => setName(e.target.value)} />
                            </Flex>
                            <Flex direction='column' gap='8px'>
                                <Text>TELEGRAM ID:</Text>
                                <Flex align='center' gap='8px'>
                                    <Input fontSize={14} value={telegramId} onChange={(e) => setTelegramId(e.target.value)} />
                                    <Tooltip label="YOU REQUIRE TO SIGN UP TO THE TELEGRAM BOT">
                                        <Box cursor='pointer'>
                                            ?
                                        </Box>
                                    </Tooltip>
                                    <Link to='https://t.me/pxl_games' target="_blank">
                                        <Image w='32px' src='/telegram.png' cursor='pointer' />
                                    </Link>
                                </Flex>
                            </Flex>
                        </Flex>
                    </ModalBody>
                    <ModalFooter pt='8px'>
                        <ButtonGroup>
                            <Button onClick={handleSave}>
                                SAVE
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Header;
