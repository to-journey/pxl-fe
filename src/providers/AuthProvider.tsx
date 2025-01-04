import { Button, Flex, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Text } from "@chakra-ui/react";
import { createContext, FC, ReactNode, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
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
    const [telegramId, setTelegramId] = useState<string>();
    const [twitterId, setTwitterId] = useState<string>();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [image, setImage] = useState<File>();
    const { mutate: updateUserInfo, isPending } = useUpdateUser(() => {
        setShowProfileEditModal(false);
        refresh();
        toast.success('User info has been successfully updated.');
    });
    const navigate = useNavigate();

    useEffect(() => {
        setTelegramId(user?.telegram_id);
        setTwitterId(user?.twitter_id);
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
            if (!user.avatar || user.avatar.trim().length == 0 || (!user.telegram_id && !user.twitter_id)) {
                setShowProfileEditModal(true);
            }
        } catch (err: any) {
            console.error(err.message);
            setUser(undefined);
        }
    }

    useEffect(() => {
        if (showProfileEditModal) {
            refresh();
        }
    }, [showProfileEditModal]);

    useEffect(() => {
        refresh();
    }, []);

    const handleSave = () => {
        const formData = new FormData();
        if (user?.avatar == null && !image) {
            toast.error('Please select user avatar.');
            return;
        }

        if (image) {
            formData.append('image', image);
        }

        if (telegramId && telegramId.trim().length > 0) {
            formData.append('telegram_id', telegramId);
        } else {
            toast.error('Please input telegram ID');
            return;
        }

        updateUserInfo(formData);
    };

    return (

        <AuthContext.Provider value={{ user, refresh, logout, showProfileEditModal: () => setShowProfileEditModal(true) }}>
            {children}
            <Input ref={fileInputRef} type="file" accept="image/*" display='none' onChange={(e) => {
                const image = e.target.files?.[0];
                if (image)
                    setAvatar(URL.createObjectURL(image));
                setImage(image);
            }} />
            <Modal size="md" isCentered isOpen={showProfileEditModal} onClose={() => setShowProfileEditModal(false)}>
                <ModalOverlay />
                <ModalContent bg='#000c' border='2px solid purple' backdropFilter='blur(4px)'>
                    <ModalCloseButton />
                    <ModalHeader textAlign="center" fontWeight="bold" fontSize="lg">
                        EDIT PROFILE
                    </ModalHeader>
                    <ModalBody pb={4}>
                        <Flex direction="column" gap={6}>
                            {/* Avatar Upload Section */}
                            <Flex direction="column" align="center">
                                <Avatar
                                    w="80px"
                                    h="80px"
                                    cursor="pointer"
                                    src={avatar}
                                    onClick={() => fileInputRef.current?.click()}
                                    border="2px solid"
                                    borderColor="whiteAlpha.400"
                                />
                            </Flex>

                            {/* X.com (Twitter) ID Field */}
                            <Flex direction="column" gap={2}>
                                <Text fontSize="sm" color="gray.400">
                                    TWITTER ID
                                </Text>
                                {twitterId ? (
                                    <Flex align="center" gap={4}>
                                        <Input
                                            fontSize="md"
                                            value={twitterId}
                                            readOnly
                                            bg="gray.700"
                                            border="1px solid"
                                            borderColor="gray.600"
                                            color="gray.400"
                                            cursor="not-allowed"
                                            _hover={{ borderColor: "gray.500" }}
                                            onChange={() => { }}
                                        />
                                    </Flex>
                                ) : (
                                    <Button
                                        leftIcon={<Image w="20px" src="/twitter.png" />}
                                        variant="outline"
                                        w="full"
                                        colorScheme="twitter"
                                        borderColor="twitter.500"
                                        _hover={{ bg: "twitter.600", borderColor: "twitter.600" }}
                                        _active={{ bg: "twitter.700", borderColor: "twitter.700" }}
                                        onClick={() => {
                                            setShowProfileEditModal(false);
                                            navigate("/wallet");
                                        }}
                                    >
                                        CONNECT TWITTER
                                    </Button>
                                )}
                            </Flex>


                        </Flex>
                    </ModalBody>
                    <ModalFooter>
                        <Button
                            onClick={handleSave}
                            isLoading={isPending}
                            loadingText="SAVING"
                            w="full"
                            colorScheme="blue"
                            bg="blue.500"
                            _hover={{ bg: "blue.400" }}
                            _active={{ bg: "blue.600" }}
                            isDisabled={isPending}
                        >
                            SAVE
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>


        </AuthContext.Provider>
    )
}

export default AuthProvider;
