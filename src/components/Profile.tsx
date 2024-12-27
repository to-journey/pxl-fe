import { Box, Divider, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import Avatar from "./Avatar";
import LoginButton from "./LoginButton";
import { useNavigate } from "react-router-dom";

const Profile = () => {
    const { user, showProfileEditModal } = useContext(AuthContext);
    const { handleLogOut, setShowDynamicUserProfile } = useDynamicContext();
    const navigate = useNavigate();


    if (user) {
        return (
            <>
                <Box display='none'>
                    <DynamicWidget />
                </Box>
                <Flex align='center' gap='8px'>
                    <Text fontSize={12}>{user?.name}</Text>
                    <Menu>
                        <MenuButton>
                            <Avatar w={{ base: '48px', lg: '80px' }} cursor='pointer' h={{ base: '48px', lg: '80px' }} src={`${import.meta.env.VITE_API_URL}/public/${user?.avatar}`} />
                        </MenuButton>
                        <MenuList bg='#000c'>
                            <MenuItem bg='#0000' _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} onClick={showProfileEditModal}>
                                EDIT PROFILE
                            </MenuItem>
                            <MenuItem bg='#0000' _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} onClick={() => navigate("/wallet")}>
                                PROFILE
                            </MenuItem>
                            <Divider />
                            <MenuItem bg='#0000' _hover={{ shadow: 'inset 0 0 12px #fc02d8' }} onClick={handleLogOut}>
                                LOGOUT
                            </MenuItem>
                        </MenuList>
                    </Menu>
                </Flex >
            </>
        )
    }

    return <LoginButton />
}

export default Profile;
