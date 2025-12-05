"use client"

import { useState, useCallback, type ReactNode } from "react"
import { useSecretCode } from "@/hooks/use-secret-code"
import { SnakeGame } from "./snake-game"
import { ActivationHint } from "./activation-hint"

// Secret code: U P U P D O W N
const SECRET_CODE = ["U", "P", "U", "P", "D", "O", "W", "N"]

export function SecretCodeProvider({ children }: { children: ReactNode }) {
  const [showGame, setShowGame] = useState(false)
  const [showHint, setShowHint] = useState(false)

  const handleActivate = useCallback(() => {
    setShowHint(true)
    setTimeout(() => {
      setShowGame(true)
      setShowHint(false)
    }, 1000)
  }, [])

  const handleClose = useCallback(() => {
    setShowGame(false)
  }, [])

  useSecretCode(SECRET_CODE, handleActivate)

  return (
    <>
      {children}
      <ActivationHint show={showHint} />
      {showGame && <SnakeGame onClose={handleClose} />}
    </>
  )
}
