import { Box } from "@chakra-ui/react";
import { Route, Routes } from "react-router";
import Header from "../components/Header";
import AboutUs from "../pages/AboutUs";
import Admin from "../pages/Admin";
import Games from "../pages/Games";
import Scoreboard from "../pages/Scoreboard";

const MainLayout = () => {
    return (
        <Box className="bg-img" h='100vh' pt={{ base: '86px', lg: '118px' }} overflowY='auto' backgroundPosition='center center'>
            <Header />
            <Routes>
                <Route path="/" element={<Games />} />
                <Route path="/scoreboard" element={<Scoreboard />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/admin" element={<Admin />} />
            </Routes>
        </Box>
    )
}

export default MainLayout;
