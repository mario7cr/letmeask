import { useState } from "react"
import { useParams } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"
import Modal from "react-modal"
import cx from "classnames"

import { useRoom } from "../../hooks/useRoom"

import { database, ref, remove, update } from "../../services/firebase"

import { Button } from "../../components/Button"
import { RoomCode } from "../../components/RoomCode"
import { Question } from "../../components/Question"

import logoImg from "../../assets/images/logo.svg"
import deleteImg from "../../assets/images/delete.svg"
import timesCircleImg from "../../assets/images/times-circle.svg"

import "../Room/styles.scss"

type RoomParams = {
  id: string
}

type ModalProps = {
  title: string
  content: string
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
      confirm: handleConfirmRemoveQuestion,
    })
    setIsOpen(true)
  }

  function handleCloseRoom() {
    setModalData({
      title: "Encerrar Sala",
      content: "Tem certeza que você deseja encerrar a sala?",
      confirmText: "Encerrar Sala",
      confirm: handleConfirmCloseRoom,
    })
    setIsOpen(true)
  }

  async function handleConfirmRemoveQuestion() {
    const roomRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
    await remove(roomRef)

    setIsOpen(false)
    toast.success("Questão removida com sucesso!", {
      duration: 2000,
      position: "bottom-center",
      icon: "🍻",
    })
  }

  async function handleConfirmCloseRoom() {
    const roomRef = ref(database, `rooms/${roomId}`)
    await update(roomRef, { closedAt: new Date() })

    setIsOpen(false)
    navigate("/")
  }

  async function handleSetQuestionAsAnswered(
    questionId: string,
    isAnswered: boolean
  ) {
    const roomRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
    await update(roomRef, { isAnswered })

    isAnswered
      ? toast.success("Questão marcada como respondida!", {
          duration: 2000,
          position: "bottom-center",
          icon: "👏",
        })
      : toast.success("Questão desmarcada como respondida.", {
          duration: 2000,
          position: "bottom-center",
          icon: "🤷‍♂️",
        })
  }

  async function handleHighlightQuestion(
    questionId: string,
    isHighlighted: boolean
  ) {
    const roomRef = ref(database, `rooms/${roomId}/questions/${questionId}`)
    await update(roomRef, { isHighlighted })

    isHighlighted
      ? toast.success("Foco aplicado com sucesso!", {
          duration: 2000,
          position: "bottom-center",
          icon: "☀️",
        })
      : toast.success("Foco removido com sucesso.", {
          duration: 2000,
          position: "bottom-center",
          icon: "🌑",
        })
  }

  return (
    <div id="page-room">
      <header>
        <div className="content">
          <img src={logoImg} alt="Letmeask" />
          <div>
            <RoomCode code={roomId || ""} />
            <Button isOutlined onClick={handleCloseRoom}>
              Encerrar sala
            </Button>
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
                isAnswered={question.isAnswered}
                isHighlighted={question.isHighlighted}
              >
                <button
                  type="button"
                  className={cx("mark-answered", {
                    answered: question.isAnswered,
                  })}
                  onClick={() =>
                    handleSetQuestionAsAnswered(
                      question.id,
                      !question.isAnswered
                    )
                  }
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12.0003"
                      cy="11.9998"
                      r="9.00375"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.44287 12.3391L10.6108 14.507L10.5968 14.493L15.4878 9.60193"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <button
                  type="button"
                  disabled={question.isAnswered}
                  className={cx("highlight", {
                    highlighted: question.isHighlighted && !question.isAnswered,
                  })}
                  onClick={() =>
                    handleHighlightQuestion(
                      question.id,
                      !question.isHighlighted
                    )
                  }
                >
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M12 17.9999H18C19.657 17.9999 21 16.6569 21 14.9999V6.99988C21 5.34288 19.657 3.99988 18 3.99988H6C4.343 3.99988 3 5.34288 3 6.99988V14.9999C3 16.6569 4.343 17.9999 6 17.9999H7.5V20.9999L12 17.9999Z"
                      stroke="#737380"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
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
          <span>{modalData?.title}</span>
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
