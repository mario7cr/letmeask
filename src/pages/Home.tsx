import { FormEvent, useState } from "react"
import { useNavigate } from "react-router-dom"

import { useAuth } from "../hooks/useAuth"
import { Button } from "../components/Button"
import { database, get, child, ref } from "../services/firebase"

import illustrationImg from "../assets/images/illustration.svg"
import logoImg from "../assets/images/logo.svg"
import googleImg from "../assets/images/google-icon.svg"

import "../styles/auth.scss"

export function Home() {
  const navigate = useNavigate()
  const { user, signInWithGoogle } = useAuth()
  const [roomCode, setRoomCode] = useState("")

  async function handleCreateRoom() {
    if (!user) {
      await signInWithGoogle()
    }

    navigate("/rooms/new")
  }

  async function handleJoinRoom(event: FormEvent) {
    event.preventDefault()

    if (!roomCode.trim()) return

    const roomRef = ref(database)
    const result = await get(child(roomRef, `rooms/${roomCode}`))

    if (!result.exists()) {
      alert("Room does not exists!")
      return
    }

    navigate(`rooms/${roomCode}`)
  }

  return (
    <div id="page-auth">
      <aside>
        <img
          src={illustrationImg}
          alt="Ilustração simbolizando perguntas e respostas"
        />
        <strong>Crie salas de Q&amp;A ao vivo</strong>
        <p>Tire as dúvidas de sua audiência em tempo real</p>
      </aside>
      <main>
        <div className="main-content">
          <img src={logoImg} alt="Letmeask" />
          <button
            type="button"
            onClick={handleCreateRoom}
            className="create-room"
          >
            <img src={googleImg} alt="Imagem do Google" />
            Crie sua sala com o Google
          </button>
          <div className="separator">Ou entre em uma sala</div>
          <form onSubmit={handleJoinRoom}>
            <input
              type="text"
              placeholder="Digite o nome da sala"
              onChange={(event) => setRoomCode(event.target.value)}
              defaultValue={roomCode}
            />
            <Button type="submit">Entrar na sala</Button>
          </form>
        </div>
      </main>
    </div>
  )
}
