import { useState } from "react"
import { useParams } from "react-router-dom"
import Modal from "react-modal"
import { useNavigate } from "react-router-dom"

import { useRoom } from "../../hooks/useRoom"

import { database, ref, remove } from "../../services/firebase"

import { Button } from "../../components/Button"
import { RoomCode } from "../../components/RoomCode"
import { Question } from "../../components/Question"

import logoImg from "../../assets/images/logo.svg"
import deleteImg from "../../assets/images/delete.svg"
import timesCircleImg from "../../assets/images/times-circle.svg"

import "../Room/styles.scss"
import { update } from "firebase/database"

type RoomParams = {
  id: string
}

type ModalProps = {
  title: string
  content: string,
  confirmText: string
  confirm: () => void
}

export function AdminRoom() {
  const navigate = useNavigate()
  const params = useParams<RoomParams>()
  const roomId = params.id || ""
  const [isOpen, setIsOpen] = useState(false)
  const [questionId, setQuestionId] = useState("")
  const [modalData, setModalData] = useState<ModalProps>()

  const { questions, title } = useRoom(roomId)

  function handleRemoveQuestion(questionId: string) {
    setQuestionId(questionId)
    setModalData({
      title: "Excluir Pergunta",
      content: "Tem certeza que você deseja excluir esta pergunta?",
      confirmText: "Excluir Pergunta",
      confirm: handleConfirmRemoveQuestion
    })
    setIsOpen(true)
  }

  function handleCloseRoom() {
    setModalData({
      title: "Encerrar Sala",
      content: "Tem certeza que você deseja encerrar a sala?",
      confirmText: "Encerrar Sala",
      confirm: handleConfirmCloseRoom
    })
    setIsOpen(true)
  }

  async function handleConfirmRemoveQuestion() {
    const roomRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
    await remove(roomRef)

    setIsOpen(false)
  }

  async function handleConfirmCloseRoom() {
    const roomRef = ref(database, `rooms/${roomId}`)
    await update(roomRef, { closedAt: new Date() })

    setIsOpen(false)
    navigate("/")
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId || ""} />
            <Button isOutlined onClick={handleCloseRoom}>Encerrar sala</Button>
          </div>
        </div>
      </header>

      <main>
        <div className="room-title">
          <h1>Sala {title}</h1>
          {questions.length > 0 && <span>{questions.length} pergunta(s)</span>}
        </div>

        <div className="question-list">
          {questions.map((question) => {
            return (
              <Question
                key={question.id}
                content={question.content}
                author={question.author}
              >
                <button
                  type="button"
                  onClick={() => handleRemoveQuestion(question.id)}
                >
                  <img src={deleteImg} alt="Excluir pergunta" />
                </button>
              </Question>
            )
          })}
        </div>
      </main>

      <Modal
        isOpen={isOpen}
        className="confirm-modal"
        overlayClassName="overlay-modal"
      >
        <header>
          <img src={timesCircleImg} alt="Danger icon" />
          <span>{ modalData?.title }</span>
        </header>
        <p>{modalData?.content}</p>
        <footer>
          <Button className="secondary" onClick={() => setIsOpen(false)}>
            Cancelar
          </Button>
          <Button className="danger" onClick={modalData?.confirm}>
            {modalData?.confirmText}
          </Button>
        </footer>
      </Modal>
    </div>
  )
}
