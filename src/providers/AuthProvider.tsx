import { Button, Flex, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from "@chakra-ui/react";
import { createContext, FC, ReactNode, useEffect, useRef, useState } from "react";
import { useUpdateUser } from "../api/users";
import Avatar from "../components/Avatar";
import { IUser } from "../interfaces";
import { axios, toast } from "../utils";

interface IAuth {
    isLoading?: boolean;
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
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUser] = useState<IUser>();
    const [showProfileEditModal, setShowProfileEditModal] = useState(false);

    const [avatar, setAvatar] = useState<string>();

    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [image, setImage] = useState<File>();
    const { mutateAsync: updateUserInfo, isPending } = useUpdateUser();

    useEffect(() => {
        setAvatar(user?.avatar ? `${import.meta.env.VITE_API_URL}/public/${user?.avatar}` : undefined);
    }, [user]);

    const logout = () => {
        setUser(undefined);
    }

    const refresh = async () => {
        try {
            const res = await axios.get('/auth/profile');
            const user = res.data;
            setUser(user);
            if (!user.avatar || user.avatar.trim().length == 0) {
                setShowProfileEditModal(true);
            }
        } catch (err: any) {
            console.error(err.message);
            setUser(undefined);
        }
        setIsLoading(false);
    }

    useEffect(() => {
        refresh();
    }, []);

    const handleSave = async () => {
        const formData = new FormData();

        if (user?.avatar == null && !image) {
            toast.error('Please select user avatar.');
            return;
        }

        if (image) {
            formData.append('image', image);
        }

        await updateUserInfo(formData);
        setShowProfileEditModal(false);
        refresh();
    };

    return (

        <AuthContext.Provider value={{ isLoading, user, refresh, logout, showProfileEditModal: () => setShowProfileEditModal(true) }}>
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
