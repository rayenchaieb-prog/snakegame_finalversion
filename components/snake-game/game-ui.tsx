"use client"

import { Volume2, VolumeX, X, Trophy, Monitor } from "lucide-react"

type Difficulty = "débutant" | "expert"

interface GameUIProps {
  score: number
  highScore: number
  difficulty: Difficulty
  soundEnabled: boolean
  isPaused: boolean
  onDifficultyChange: (difficulty: Difficulty) => void
  onSoundToggle: () => void
  onClose: () => void
  leaderboard: number[]
  liberatedComputers: number
}

export function GameUI({
  score,
  highScore,
  difficulty,
  soundEnabled,
  onDifficultyChange,
  onSoundToggle,
  onClose,
  leaderboard,
  liberatedComputers,
}: GameUIProps) {
  return (
    <div className="mb-4 flex w-full max-w-3xl flex-col gap-3 px-4">
      <div className="flex items-center justify-center gap-2 text-center">
        <span className="text-2xl">🐧</span>
        <h1 className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-xl font-bold text-transparent">
          NIRD Snake - Libère les PC !
        </h1>
        <span className="text-2xl">🖥️</span>
      </div>

      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Score</p>
            <p className="font-mono text-3xl font-bold text-green-400">{score}</p>
          </div>
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-muted-foreground">Record</p>
            <p className="font-mono text-2xl font-semibold text-orange-400">{highScore}</p>
          </div>
          <div className="flex items-center gap-2 rounded-lg border border-green-500/30 bg-green-500/10 px-3 py-1.5">
            <Monitor className="h-5 w-5 text-green-400" />
            <div className="text-center">
              <p className="text-xs uppercase tracking-wider text-green-300/70">Libérés</p>
              <p className="font-mono text-lg font-bold text-green-400">{liberatedComputers}</p>
            </div>
          </div>
          {leaderboard.length > 0 && (
            <div className="group relative">
              <Trophy className="h-6 w-6 cursor-help text-yellow-500" />
              <div className="pointer-events-none absolute left-0 top-full z-10 mt-2 w-48 rounded-lg border border-border bg-card p-3 opacity-0 shadow-xl transition-opacity group-hover:pointer-events-auto group-hover:opacity-100">
                <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Top 5 Résistants
                </p>
                {leaderboard.map((s, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-muted-foreground">#{i + 1}</span>
                    <span className="font-mono text-foreground">{s} pts</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex overflow-hidden rounded-lg border border-border">
            <button
              onClick={() => onDifficultyChange("débutant")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                difficulty === "débutant"
                  ? "bg-green-600 text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Débutant (20x20)
            </button>
            <button
              onClick={() => onDifficultyChange("expert")}
              className={`px-3 py-1.5 text-sm font-medium transition-colors ${
                difficulty === "expert"
                  ? "bg-orange-500 text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              Expert (15x15)
            </button>
          </div>

          <button
            onClick={onSoundToggle}
            className="rounded-lg border border-border bg-secondary p-2 text-secondary-foreground transition-colors hover:bg-secondary/80"
          >
            {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>

          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-destructive/10 p-2 text-destructive transition-colors hover:bg-destructive/20"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
