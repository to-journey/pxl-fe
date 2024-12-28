import { Flex } from "@chakra-ui/react";
import { Route, Routes } from "react-router";
import Header from "../components/Header";
import AboutUs from "../pages/AboutUs";
import Admin from "../pages/Admin";
import Games from "../pages/Games";
import Wallet from "../pages/Profile";
import Scoreboard from "../pages/Scoreboard";

const MainLayout = () => {
    return (
        <Flex className="bg-img" h='100vh' direction='column' overflowY='auto' backgroundPosition='center center'>
            <Header />
            <Routes>
                <Route path="/" element={<Games />} />
                <Route path="/scoreboard" element={<Scoreboard />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Flex>
    )
}

export default MainLayout;
