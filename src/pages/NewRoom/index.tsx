import { FormEvent, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import {} from "react-router-dom"

import { Button } from "../../components/Button"
import { database, ref, push } from "../../services/firebase"
import { useAuth } from "../../hooks/useAuth"

import illustrationImg from "../../assets/images/illustration.svg"
import logoImg from "../../assets/images/logo.svg"

import "../../styles/auth.scss"

export function NewRoom() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [newRoom, setNewRoom] = useState("")

  function handleCreateRoom(event: FormEvent) {
    event.preventDefault()

    if (!newRoom.trim()) return

    const roomRef = ref(database, "rooms")
    push(roomRef, {
      title: newRoom,
      authorId: user?.id,
    }).then((value) => navigate(`/rooms/${value.key}`))
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
          <h2>Crie uma nova sala</h2>
          <form onSubmit={handleCreateRoom}>
            <input
              type="text"
              placeholder="Nome da sala"
              onChange={(event) => setNewRoom(event.target.value)}
              defaultValue={newRoom}
            />
            <Button type="submit">Criar sala</Button>
          </form>
          <p>
            Quer entrar em uma sala existente? <Link to="/">Clique aqui</Link>
          </p>
        </div>
      </main>
    </div>
  )
}