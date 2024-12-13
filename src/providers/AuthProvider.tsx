import { Box, Button, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Spinner, Text, Tooltip } from "@chakra-ui/react";
import { createContext, FC, ReactNode, useEffect, useRef, useState } from "react";
import { Link } from "react-router";
import { useUpdateUser } from "../api/users";
import Avatar from "../components/Avatar";
import { IUser } from "../interfaces";
import { axios, toast } from "../utils";

interface IAuth {
    user?: IUser;
    setUser?: (user: IUser) => void;
    refresh?: () => void;
    logout?: () => void;
    showProfileEditModal?: () => void;
}

export const AuthContext = createContext<IAuth>({});

interface Props {
    children: ReactNode;
}

const AuthProvider: FC<Props> = ({ children }) => {
    const [user, setUser] = useState<IUser>();
    const [showProfileEditModal, setShowProfileEditModal] = useState(false);
    const [avatar, setAvatar] = useState<string>();
    const [name, setName] = useState<string>();
    const [telegramId, setTelegramId] = useState<string>();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [image, setImage] = useState<File>();
    const { mutate: handleUpdateUserInfo, isPending } = useUpdateUser(() => {
        setShowProfileEditModal(false);
        refresh();
        toast.success('User info has been successfully updated.');
    });

    useEffect(() => {
        setName(user?.name);
        setTelegramId(user?.telegram_id);
        setAvatar(user?.avatar ? `${import.meta.env.VITE_API_URL}/public/${user?.avatar}` : undefined);
    }, [user]);

    const logout = () => {
        setUser(undefined);
    }

    const refresh = async () => {
        try {
            const res = await axios.get('/user-info');
            const user = res.data;
            setUser(user);
            if (!user.avatar || user.avatar.trim().length == 0 || !user.telegram_id || user.telegram_id.trim().length == 0) {
                setShowProfileEditModal(true);
            }
        } catch (err: any) {
            console.error(err.message);
            setUser(undefined);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    const handleSave = () => {
        const formData = new FormData();
        if (user?.avatar == null && !image) {
            toast.error('Please select user avatar.');
            return;
        }
        if (image)
            formData.append('image', image);
        if (name && name.trim().length > 0) {
            formData.append('name', name);
        } else {
            toast.error('Please input user name');
            return;
        }
        if (telegramId && telegramId.trim().length > 0) {
            formData.append('telegram_id', telegramId);
        } else {
            toast.error('Please input telegram ID');
            return;
        }
        handleUpdateUserInfo(formData);
    }

    return (
        <AuthContext.Provider value={{ user, refresh, logout, showProfileEditModal: () => setShowProfileEditModal(true) }}>
            {children}
            <Input ref={fileInputRef} type="file" accept="image/*" display='none' onChange={(e) => {
                const image = e.target.files?.[0];
                if (image)
                    setAvatar(URL.createObjectURL(image));
                setImage(image);
            }} />
            <Modal size='xs' isCentered isOpen={showProfileEditModal} onClose={() => setShowProfileEditModal(false)}>
                <ModalOverlay />
                <ModalContent bg='#000c'>
                    <ModalCloseButton />
                    <ModalHeader pb='8px'>
                        EDIT PROFILE
                    </ModalHeader>
                    <ModalBody>
                        <Flex direction='column' gap='16px'>
                            <Flex justify='center'>
                                <Avatar w='64px' h='64px' cursor='pointer' src={avatar} onClick={() => fileInputRef.current?.click()} />
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
                                    <Link to='https://t.me/pxlgames_bot' target="_blank">
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
        </AuthContext.Provider>
    )
}

export default AuthProvider;
