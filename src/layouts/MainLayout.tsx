import { Flex } from "@chakra-ui/react";
import { Route, Routes } from "react-router";
import Footer from "../components/Footer";
import Header from "../components/Header";
import AboutUs from "../pages/AboutUs";
import Admin from "../pages/Admin";
import Games from "../pages/Games";
import PrivacyPolicy from "../pages/PrivacyPolicy";
import Wallet from "../pages/Profile";
import Scoreboard from "../pages/Scoreboard";
import TermsOfService from "../pages/TermsOfService";

const MainLayout = () => {
    return (
        <Flex className="bg-img" h='calc(var(--vh, 1vh) * 100)' direction='column' justify='space-between' overflowY='auto' backgroundPosition='center center'>
            <Header />
            <Routes>
                <Route path="/" element={<Games />} />
                <Route path="/scoreboard" element={<Scoreboard />} />
                <Route path="/wallet" element={<Wallet />} />
                <Route path="/about-us" element={<AboutUs />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/terms-of-service" element={<TermsOfService />} />
                <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            </Routes>
            <Footer />
        </Flex>
    )
}

export default MainLayout;
