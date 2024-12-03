import { Box } from "@chakra-ui/react"
import { useEffect } from "react"
import { Route, Routes } from "react-router"
import Header from "./components/Header"
import Games from "./pages/Games"
import Questions from "./pages/Questions"
import Scoreboard from "./pages/Scoreboard"

function App() {
  useEffect(() => {
    localStorage.setItem('chakra-ui-color-mode', 'dark');
  }, []);

  return (
    <Box className="bg-img" h='100vh' pt='96px' overflowY='auto' backgroundPosition='center center'>
      <Header />
      <Routes>
        <Route path="/" element={<Games />} />
        <Route path="/scoreboard" element={<Scoreboard />} />
        <Route path="/questions" element={<Questions />} />
      </Routes>
    </Box>
  )
}

export default App
