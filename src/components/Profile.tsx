import { Avatar, Flex, Menu, MenuButton, MenuItem, MenuList, Text } from "@chakra-ui/react";
import { useIsLoggedIn } from "@dynamic-labs/sdk-react-core";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";
import LoginButton from "./LoginButton";

const Profile = () => {
    const { user } = useContext(AuthContext);
    const isLoggedIn = useIsLoggedIn();

    // setIsOpenProfileEditModal(true)

    if (isLoggedIn) {
        return (
            <Flex align='center' gap='8px'>
                <Menu>
                    <MenuButton>
                        <Avatar size='md' cursor='pointer' src={`${import.meta.env.VITE_API_URL}/public/${user?.avatar}`} onClick={() => { }} />
                    </MenuButton>
                    <MenuList>
                        <MenuItem>
                            LOGOUT
                        </MenuItem>
                    </MenuList>
                </Menu>
                <Text fontSize={12}>{user?.name}</Text>
            </Flex>
        )
    }
    return <LoginButton display={{ base: 'none', lg: 'unset' }} />
}

export default Profile;
