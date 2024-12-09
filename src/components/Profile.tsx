import { Box, Button, Divider, Flex, Image, Input, Menu, MenuButton, MenuItem, MenuList, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { DynamicUserProfile, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useContext, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useUpdateUser } from "../api/users";
import { AuthContext } from "../providers/AuthProvider";
import { toast } from "../utils";
import LoginButton from "./LoginButton";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const { handleLogOut } = useDynamicContext();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [showProfileModal, setShowProfileModal] = useState(false);
    const [avatar, setAvatar] = useState<string>();
    const [image, setImage] = useState<File>();
    const [name, setName] = useState('');
    const [telegramId, setTelegramId] = useState('');
    const { mutate: handleUpdateUserInfo, isPending } = useUpdateUser(() => {
        toast.success('User info has been successfully updated.');
        setShowProfileModal(false);
    });

    const handleSave = () => {
        const formData = new FormData();
        if (user?.avatar == null && !image) {
            toast.error('Please select user avatar.');
            return;
        }
        if (image)
            formData.append('image', image);
        if (name.trim().length == 0) {
            toast.error('Please input user name');
            return;
        }
        formData.append('name', name);
        if (telegramId.trim().length == 0) {
            toast.error('Please input telegram ID');
            return;
        }
        formData.append('telegram_id', telegramId);
        handleUpdateUserInfo(formData);
    }

    useEffect(() => {
        if (user?.name) setName(user.name);
        if (user?.telegram_id) setTelegramId(user.telegram_id);
        if (user?.avatar) setAvatar(`${import.meta.env.VITE_API_URL}/public/${user.avatar}`);
    }, [user]);

    if (user) {
        return (
            <>
                <Input ref={fileInputRef} type="file" accept="image/*" display='none' onChange={(e) => {
                    const image = e.target.files?.[0];
                    if (image)
                        setAvatar(URL.createObjectURL(image));
                    setImage(image);
                }} />
                <Flex align='center' gap='8px'>
                    <Menu>
                        <MenuButton>
                            <Image w={{ base: '48px', lg: '80px' }} h={{ base: '48px', lg: '80px' }} objectFit='cover' cursor='pointer' src={`${import.meta.env.VITE_API_URL}/public/${user?.avatar}`} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={() => setShowProfileModal(true)}>
                                EDIT PROFILE
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogOut}>
                                LOGOUT
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <Text fontSize={12}>{user?.name}</Text>
                </Flex >
                <Modal size='xs' isCentered isOpen={showProfileModal} onClose={() => setShowProfileModal(false)}>
                    <ModalOverlay />
                    <ModalContent bg='#000c'>
                        <ModalCloseButton />
                        <ModalHeader pb='8px'>
                            EDIT PROFILE
                        </ModalHeader>
                        <ModalBody>
                            <Flex direction='column' gap='16px'>
                                <Flex justify='center'>
                                    <Image w='64px' h='64px' objectFit='cover' cursor='pointer' src={avatar} onClick={() => fileInputRef.current?.click()} />
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
                                            <Box cursor='pointer'>?</Box>
                                        </Tooltip>
                                        <Link to='https://t.me/pxl_games' target="_blank">
                                            <Image w='32px' src='/telegram.png' cursor='pointer' />
                                        </Link>
                                    </Flex>
                                </Flex>
                            </Flex>
                        </ModalBody>
                        <ModalFooter pt='8px'>
                            <Button onClick={handleSave}>
                                {isPending && <Spinner size='sm' mr={1} />}
                                SAVE
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                </Modal>
                <DynamicUserProfile />
            </>
        )
    }
    return <LoginButton display={{ base: 'none', lg: 'unset' }} />
}

export default Profile;
