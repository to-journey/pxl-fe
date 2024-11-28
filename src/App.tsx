import { Box } from "@chakra-ui/react"
import { Route, BrowserRouter as Router, Routes } from "react-router"
import Header from "./components/Header"
import Games from "./pages/Games"

function App() {
  return (
    <Box h='100vh' pt='96px' overflowY='auto'>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Games />} />
        </Routes>
      </Router>
    </Box>
  )
}

export default App
