import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthContextProvider } from "./contexts/AuthContextProvider"

import { Home } from "./pages/Home"
import { NewRoom } from "./pages/NewRoom"
import { Room } from "./pages/Room"

import "./styles/global.scss"

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<Room />}></Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App
