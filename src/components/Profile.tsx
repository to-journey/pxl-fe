import { Box, Divider, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { DynamicWidget, useDynamicContext } from "@dynamic-labs/sdk-react-core";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import Avatar from "./Avatar";
import LoginButton from "./LoginButton";

const Profile = () => {
    const { user, showProfileEditModal } = useContext(AuthContext);
    const { handleLogOut, setShowDynamicUserProfile } = useDynamicContext();

    if (user) {
        return (
            <>
                <Box display='none'>
                    <DynamicWidget />
                </Box>
                <Flex align='center' gap='8px'>
                    <Menu>
                        <MenuButton>
                            <Avatar w={{ base: '48px', lg: '80px' }} cursor='pointer' h={{ base: '48px', lg: '80px' }} src={`${import.meta.env.VITE_API_URL}/public/${user?.avatar}`} />
                        </MenuButton>
                        <MenuList>
                            <MenuItem onClick={showProfileEditModal}>
                                EDIT PROFILE
                            </MenuItem>
                            <MenuItem onClick={() => setShowDynamicUserProfile(true)}>
                                PROFILE
                            </MenuItem>
                            <Divider />
                            <MenuItem onClick={handleLogOut}>
                                LOGOUT
                            </MenuItem>
                        </MenuList>
                    </Menu>
                    <Text fontSize={12}>{user?.name}</Text>
                </Flex >
            </>
        )
    }
    return <LoginButton />
}

export default Profile;
