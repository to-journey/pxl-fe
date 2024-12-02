import { Avatar, Box, Button, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text } from "@chakra-ui/react";
import { useContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { useUpdateUserInfo } from "../api/users";
import { AuthContext } from "../providers/AuthProvider";

const Header = () => {
    const navigate = useNavigate();
    const { user } = useContext(AuthContext);
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
                <Flex position='relative' h='96px' bgGradient='linear(to-r, teal.800, teal.500)' px={{ base: '16px', lg: '96px' }} py='16px' gap={{ base: '16px', lg: '32px' }}>
                    <Image src="/logo.png" />
                    <Flex w='full' justify='space-between'>
                        <Flex align='center' gap='16px'>
                            <Button bg="#222" onClick={() => navigate('/')}>
                                GAMES
                            </Button>
                            <Button bg="#222" onClick={() => navigate('/scoreboard')}>
                                SCOREBOARD
                            </Button>
                            <Button bg="#222" onClick={() => navigate('/questions')}>
                                QUESTIONS
                            </Button>
                        </Flex>
                        <Flex align='center' gap={{ base: '8px', lg: '16px' }}>
                            {user ? (
                                <>
                                    <Avatar size={{ base: 'sm', lg: 'lg' }} cursor='pointer' src={`${import.meta.env.VITE_API_URL}/public/${user.avatar}`} onClick={() => setIsOpenProfileEditModal(true)} />
                                    <Text>
                                        {user.name}
                                    </Text>
                                </>
                            ) : (
                                <Button w='160px' bg="#222">
                                    SIGN IN
                                </Button>
                            )}
                        </Flex>
                    </Flex>
                    <Box position='absolute' left={0} bottom={0} w='full' h='6px' bgGradient='linear(to-b, #0000, teal.400)' />
                </Flex>
                <Box h='6px' bgGradient='linear(to-b, teal.800, teal.500, teal.700)' />
            </Box>
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
                        <Button onClick={handleSave}>
                            {isLoading && <Spinner size='sm' mr={2} />}
                            Save
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    )
}

export default Header;
