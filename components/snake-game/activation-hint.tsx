"use client"

import { useEffect, useState } from "react"

interface ActivationHintProps {
  show: boolean
}

export function ActivationHint({ show }: ActivationHintProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (show) {
      setVisible(true)
      const timer = setTimeout(() => setVisible(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [show])

  if (!visible) return null

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 fixed bottom-8 left-1/2 z-[9998] -translate-x-1/2 duration-500">
      <div className="flex items-center gap-3 rounded-full border border-green-500/30 bg-card/90 px-6 py-3 shadow-[0_0_30px_rgba(34,197,94,0.3)] backdrop-blur-md">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500/20">
          <span className="text-lg">🐧</span>
        </div>
        <span className="font-medium text-foreground">Mode NIRD Activé - Libère les PC !</span>
        <div className="ml-2 flex gap-1">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-2 w-2 animate-pulse rounded-full bg-green-500"
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
