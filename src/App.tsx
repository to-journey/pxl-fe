import { useEffect } from "react";
import { Route, Routes } from "react-router";
import GameLayout from "./layouts/GameLayout";
import MainLayout from "./layouts/MainLayout";

function App() {
  useEffect(() => {
    localStorage.setItem('chakra-ui-color-mode', 'dark');
  }, []);

  return (
    <Routes>
      <Route path="/games/*" element={<GameLayout />} />
      <Route path="*" element={<MainLayout />} />
    </Routes>
  )
}

export default App
