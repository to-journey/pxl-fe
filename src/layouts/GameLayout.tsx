import { Button } from "@chakra-ui/react";
import { Route, Routes, useNavigate } from "react-router";
import { ReturnIcon } from "../components/icons";
import Digitus from "../pages/games/Digitus";
import Pump from "../pages/games/Pump";
import Rock from "../pages/games/Rock";
import Velocitas from "../pages/games/Velocitas";
import Swapsicles from "../pages/games/Swapsicles";

const GameLayout = () => {
    const navigate = useNavigate();

    return (
        <>
            <Button position='fixed' right='16px' top='16px' zIndex={60} px={2} bg='#6f00ff' color='white' _hover={{ bg: '#00ffcc' }} onClick={() => navigate('/')}>
                <ReturnIcon />
            </Button>
            <Routes>
                <Route path="/pump.html" element={<Pump />} />
                <Route path="/digitus.html" element={<Digitus />} />
                <Route path="/velocitas.html" element={<Velocitas />} />
                <Route path="/rock.html" element={<Rock />} />
                <Route path="/swapsicles.html" element={<Swapsicles />} />
            </Routes>
        </>
    )
}

export default GameLayout;