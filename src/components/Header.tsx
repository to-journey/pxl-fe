import { Avatar, Box, Button, ButtonGroup, Drawer, DrawerBody, DrawerCloseButton, DrawerContent, DrawerFooter, DrawerHeader, DrawerOverlay, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useUpdateUserInfo } from "../api/users";
import { AuthContext } from "../providers/AuthProvider";

const Header = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
    const [isOpenMenu, setIsOpenMenu] = useState(false);
    const [isOpenProfileEditModal, setIsOpenProfileEditModal] = useState(false);
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [image, setImage] = useState<File>();
    const [avatar, setAvatar] = useState<string>();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const { mutate: handleUpdateUserInfo, isLoading } = useUpdateUserInfo();

    const handleSave = () => {
        const formData = new FormData();
        if (image) {
            formData.append('image', image);
        }
        formData.append('name', name);
        formData.append('email', email);
        handleUpdateUserInfo(formData);
    }

    useEffect(() => {
        if (user?.name) setName(user.name);
        if (user?.email) setEmail(user.email);
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
            <Box position="fixed" top={0} w='full'>
                <Flex position='relative' h='80px' bgGradient='linear(to-r, #1c3f3fc0, #28b2a5c0)' px={{ base: '16px', lg: '96px' }} py='16px' gap={{ base: '16px', lg: '32px' }}>
                    <Image src="/logo.png" />
                    <Flex w='full'>
                        <Flex display={{ base: 'none', lg: 'flex' }} align='center' gap='16px'>
                            <Button bg="#222" onClick={() => navigate('/')}>
                                HOME
                            </Button>
                            <Button bg="#222" onClick={() => navigate('/scoreboard')}>
                                SCOREBOARD
                            </Button>
                            <Button bg="#222" onClick={() => navigate('/questions')}>
                                QUESTIONS
                            </Button>
                        </Flex>
                        {user?.id ? (
                            <>
                                <Flex ml='auto' display={{ base: 'none', lg: 'flex' }} align='center' gap='8px' onClick={() => setIsOpenProfileEditModal(true)}>
                                    <Avatar size='md' cursor='pointer' src={`${import.meta.env.VITE_API_URL}/public/${user.avatar}`} />
                                    <Text>{user.name}</Text>
                                </Flex>
                                <Flex ml='auto' display={{ base: 'flex', lg: 'none' }} align='center' gap='8px' onClick={() => setIsOpenMenu(true)}>
                                    <Avatar size='md' cursor='pointer' src={`${import.meta.env.VITE_API_URL}/public/${user.avatar}`} />
                                    <Text>{user.name}</Text>
                                </Flex>
                            </>
                        ) : (
                            <Button ml='auto' bg="#222">
                                SIGN IN
                            </Button>
                        )}
                    </Flex>
                    <Box position='absolute' left={0} bottom={0} w='full' h='6px' bgGradient='linear(to-b, #0000, #28b2a5c0)' />
                </Flex>
                <Box h='6px' bgGradient='linear(to-b, #1c3f3fc0, #28b2a5c0, #1a5b5bc0)' />
            </Box>
            <Drawer isOpen={isOpenMenu} onClose={() => setIsOpenMenu(false)}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader>
                        {user?.id && (
                            <Flex align='center' gap='8px'>
                                <Avatar size='md' cursor='pointer' src={`${import.meta.env.VITE_API_URL}/public/${user.avatar}`} />
                                <Text>{user.name}</Text>
                            </Flex>
                        )}
                    </DrawerHeader>
                    <DrawerBody>
                        <Flex direction='column' gap={4}>
                            <Button bg="#222" onClick={() => {
                                navigate('/');
                                setIsOpenMenu(false);
                            }}>
                                HOME
                            </Button>
                            <Button bg="#222" onClick={() => {
                                navigate('/scoreboard');
                                setIsOpenMenu(false);
                            }}>
                                SCOREBOARD
                            </Button>
                            <Button bg="#222" onClick={() => {
                                navigate('/questions');
                                setIsOpenMenu(false);
                            }}>
                                QUESTIONS
                            </Button>
                        </Flex>
                    </DrawerBody>
                    <DrawerFooter>
                        {user?.id ? (
                            <Button onClick={() => setIsOpenProfileEditModal(true)}>
                                Edit profile
                            </Button>
                        ) : (
                            <Button bg="#222">
                                SIGN IN
                            </Button>
                        )}
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
            <Modal size='xs' isCentered isOpen={isOpenProfileEditModal} onClose={() => setIsOpenProfileEditModal(false)}>
                <ModalOverlay />
                <ModalContent>
                    <ModalCloseButton />
                    <ModalHeader pb='8px'>
                        Edit profile
                    </ModalHeader>
                    <ModalBody>
                        <Flex direction='column' gap='8px'>
                            <Flex justify='center'>
                                <Avatar src={avatar} cursor='pointer' size='lg' onClick={() => fileInputRef.current?.click()} />
                            </Flex>
                            <Flex direction='column' gap='4px'>
                                <Text>
                                    User name:
                                </Text>
                                <Input value={name} onChange={(e) => setName(e.target.value)} />
                            </Flex>
                            <Flex direction='column' gap='4px'>
                                <Text>
                                    Email:
                                </Text>
                                <Input value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Flex>
                        </Flex>
                    </ModalBody>
                    <ModalFooter pt='8px'>
                        <ButtonGroup>
                            <Button onClick={handleSave}>
                                {isLoading && <Spinner size='sm' mr={2} />}
                                Save
                            </Button>
                        </ButtonGroup>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Header;
