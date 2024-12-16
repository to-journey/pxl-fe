import { Button } from "@chakra-ui/react";
import { Route, Routes, useNavigate } from "react-router";
import { ReturnIcon } from "../components/icons";
import Rock from "../pages/games/Rock";
import Digitus from "../pages/games/Digitus";
import Velocitas from "../pages/games/Velocitas";

const GameLayout = () => {
    const navigate = useNavigate();

    return (
        <>
            <Button position='fixed' right='16px' top='16px' zIndex={60} px={2} bg='#6f00ff' color='white' _hover={{ bg: '#00ffcc' }} onClick={() => navigate('/')}>
                <ReturnIcon />
            </Button>
            <Routes>
                <Route path="/digitus.html" element={<Digitus />} />
                <Route path="/velocitas.html" element={<Velocitas />} />
                <Route path="/rock.html" element={<Rock />} />
            </Routes>
        </>
    )
}

export default GameLayout;