import { ButtonHTMLAttributes } from "react"

import "./styles.scss"

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  isOutlined?: boolean
}

export function Button({
  className,
  isOutlined = false,
  ...props
}: ButtonProps) {
  className = `button ${className} ${isOutlined && "outlined"}`

  return <button className={className} {...props}></button>
}
