import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import { Avatar, Button, Flex, Link, Modal, ModalBody, ModalCloseButton, ModalContent, ModalOverlay, Text } from "@chakra-ui/react";
import copy from "copy-to-clipboard";
import _ from "lodash";
import { FC, useMemo, useState } from "react";
import { useDeleteUserById, useGetUsers, useUpdateUserById } from "../api/users";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    userId?: number;
}

const UserProfileModal: FC<Props> = ({ isOpen, onClose, userId }) => {
    const { users } = useGetUsers();
    const { mutate: updateUser } = useUpdateUserById();
    const { mutate: deleteUser } = useDeleteUserById();
    const [copied, setCopied] = useState(false);

    const user = useMemo(() => _.find(users, (user) => user.id == userId), [users, userId]);

    const handleCopy = () => {
        if (copied) return;
        copy(user.wallet_address);
        setCopied(true);
        setTimeout(() => {
            setCopied(false);
        }, 1500);
    }

    if (!user) return <></>;

    return (
        <Modal size='sm' isCentered isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent p={4} bg='#000c' border='2px solid purple' backdropFilter='blur(4px)'>
                <ModalCloseButton />
                <ModalBody>
                    <Flex direction='column' gap='16px'>
                        <Flex justify='center'>
                            <Avatar size='xl' src={`${import.meta.env.VITE_API_URL}/public/${user.avatar}`} />
                        </Flex>
                        <Flex direction='column' gap='8px'>
                            <Text whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>EMAIL: {user.email}</Text>
                            <Text whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>USERNAME: {user.username}</Text>
                            <Link target="_blank" href={`https://x.com/${user.twitter_id}`} whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>TWITTER: {user.twitter_id}</Link>
                            <Flex>
                                <Text whiteSpace='nowrap' overflow='hidden' textOverflow='ellipsis'>WALLET: {user.wallet_address}</Text>
                                <Button mt={-0.5} size='xs' onClick={handleCopy}>
                                    {copied ? <CheckIcon /> : <CopyIcon />}
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex gap={2}>
                            {!user.is_banned ? (
                                <Button
                                    p='12px 12px 14px 12px'
                                    size='xs'
                                    _hover={{ shadow: 'inset 0 0 12px #fc02d8' }}
                                    onClick={() => updateUser({ id: user.id, is_banned: true })}
                                >
                                    BAN
                                </Button>
                            ) : (
                                <Button
                                    p='12px 12px 14px 12px'
                                    size='xs'
                                    _hover={{ shadow: 'inset 0 0 12px #fc02d8' }}
                                    onClick={() => updateUser({ id: user.id, is_banned: false })}
                                >
                                    UNBAN
                                </Button>
                            )}
                            <Button
                                p='12px 12px 14px 12px'
                                size='xs'
                                _hover={{ shadow: 'inset 0 0 12px #fc02d8' }}
                                onClick={() => deleteUser(user.id)}
                            >
                                DELETE
                            </Button>
                        </Flex>
                    </Flex>
                </ModalBody>
            </ModalContent>
        </Modal>
    )
}

export default UserProfileModal;
