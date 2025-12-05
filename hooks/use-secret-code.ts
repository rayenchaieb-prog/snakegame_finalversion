"use client"

import { useState, useEffect, useCallback, useRef } from "react"

export function useSecretCode(secretCode: string[], onActivate: () => void) {
  const [inputSequence, setInputSequence] = useState<string[]>([])
  const [isActivated, setIsActivated] = useState(false)
  const secretCodeRef = useRef(secretCode)
  const onActivateRef = useRef(onActivate)

  useEffect(() => {
    secretCodeRef.current = secretCode
  }, [secretCode])

  useEffect(() => {
    onActivateRef.current = onActivate
  }, [onActivate])

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    const key = event.key.toUpperCase()

    setInputSequence((prev) => {
      const newSequence = [...prev, key].slice(-secretCodeRef.current.length)

      if (newSequence.join("") === secretCodeRef.current.join("")) {
        setIsActivated(true)
        onActivateRef.current()
        return []
      }

      return newSequence
    })
  }, [])

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handleKeyDown])

  const deactivate = useCallback(() => {
    setIsActivated(false)
    setInputSequence([])
  }, [])

  return { isActivated, deactivate, progress: inputSequence.length / secretCodeRef.current.length }
}
