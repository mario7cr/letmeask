import { BrowserRouter, Route, Routes } from "react-router-dom"
import { AuthContextProvider } from "./contexts/AuthContextProvider"
import Modal from "react-modal"

import { Home } from "./pages/Home"
import { NewRoom } from "./pages/NewRoom"
import { Room } from "./pages/Room"
import { AdminRoom } from "./pages/AdminRoom"

import "./styles/global.scss"
import "./styles/modal.scss"

Modal.setAppElement("#root")

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<Room />}></Route>

          <Route path="/admin/rooms/:id" element={<AdminRoom />}></Route>
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  )
}

export default App
