import copyImg from '../../assets/images/copy.svg'

import './styles.scss'

type RoomCodeProps = {
  code: string
}

export function RoomCode(props: RoomCodeProps) {
  function copyToClipboard() {
    navigator.clipboard.writeText(props.code)
  }

  return (
    <button className="room-code">
      <div>
        <img src={copyImg} alt="Copy room code" onClick={copyToClipboard} />
      </div>
      <span>Sala #{props.code}</span>
    </button>
  )
}