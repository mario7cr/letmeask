import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthContextProvider } from "./contexts/AuthContextProvider"

import { Home } from "./pages/Home"
import { NewRoom } from "./pages/NewRoom"

import "./styles/global.scss"

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App
