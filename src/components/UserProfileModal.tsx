import { Avatar, Flex, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import _ from "lodash";
import { FC, useMemo } from "react";
import { useGetUsers } from "../api/users";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    userId?: number;
}

const UserProfileModal: FC<Props> = ({ isOpen, onClose, userId }) => {
    const { users } = useGetUsers();

    const user = useMemo(() => _.find(users, (user) => user.id == userId), [users, userId]);

    return (
        <Modal size='sm' isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent bg='#000c'>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction='column' gap='16px' align='center'>
                        <Avatar size='xl' src={`${import.meta.env.VITE_API_URL}/public/${user?.avatar}`} />
                        <Flex direction='column' gap='8px'>
                            <Text>USERNAME: {user?.name}</Text>
                            <Text>CHAT ID: {user?.telegram_id}</Text>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default UserProfileModal;
