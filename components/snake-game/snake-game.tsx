"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { GameUI } from "./game-ui"
import { Particles } from "./particles"
import { renderPenguin } from "./penguin-renderer"
import { CELL_SIZE, GAME_CONFIG } from "./constants"

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"
type Position = { x: number; y: number }
type Difficulty = "débutant" | "expert"

interface GameState {
  snake: Position[]
  food: Position
  direction: Direction
  score: number
  highScore: number
  isGameOver: boolean
  difficulty: Difficulty
  liberatedComputers: number
  countdown: number
}

let particleIdCounter = 0
const countdownValue = 3

const MESSAGES = [
  "🐧 Un PC libéré !",
  "Linux vaincra !",
  "Bye bye Windows !",
  "Vive le Libre !",
  "L'obsolescence ? Non merci !",
  "Le village résiste !",
  "NERD en force !",
  "Tux approuve !",
  "Open Source FTW !",
  "David bat Goliath !",
]

export function SnakeGame({ onClose }: { onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const animationFrameRef = useRef<number>()
  const lastUpdateRef = useRef<number>(0)
  const nextDirectionRef = useRef<Direction>("RIGHT")
  const lastDirectionChangeRef = useRef<number>(0)
  const gameStartTimeRef = useRef<number>(0)
  const countdownRef = useRef<number>(3)
  const particleCleanupRef = useRef<NodeJS.Timeout | null>(null)
  const movementCounterRef = useRef<number>(0)
  const [message, setMessage] = useState("")
  const [showMessage, setShowMessage] = useState(false)
  const [particles, setParticles] = useState<{ x: number; y: number; id: number }[]>([])
  const [gridSize, setGridSize] = useState({ cols: 10, rows: 10 })
  const [soundEnabled, setSoundEnabled] = useState(true)
  const audioContextRef = useRef<AudioContext | null>(null)
  const [leaderboard, setLeaderboard] = useState<number[]>(() => {
    return typeof window !== "undefined" ? JSON.parse(localStorage.getItem("nirdSnakeLeaderboard") || "[]") : []
  })

  const [gameState, setGameState] = useState<GameState>(() => ({
    snake: [{ x: Math.floor(gridSize.cols / 2), y: Math.floor(gridSize.rows / 2) }],
    food: { x: 7, y: 5 },
    direction: "RIGHT",
    score: 0,
    highScore: typeof window !== "undefined" ? Number.parseInt(localStorage.getItem("nirdSnakeHighScore") || "0") : 0,
    isGameOver: false,
    difficulty: "débutant",
    liberatedComputers: 0,
    countdown: 3,
  }))

  const playSound = useCallback(
    (frequency: number, duration: number, type: OscillatorType = "sine") => {
      if (!soundEnabled) return
      try {
        if (!audioContextRef.current) {
          audioContextRef.current = new AudioContext()
        }
        const ctx = audioContextRef.current
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()

        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)

        oscillator.frequency.value = frequency
        oscillator.type = type
        gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration)

        oscillator.start(ctx.currentTime)
        oscillator.stop(ctx.currentTime + duration)
      } catch (e) {
        // Audio not supported
      }
    },
    [soundEnabled],
  )

  useEffect(() => {
    const updateGridSize = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect()
        const cols = Math.floor((rect.width - 40) / CELL_SIZE)
        const rows = Math.floor((rect.height - 160) / CELL_SIZE)
        setGridSize({ cols: Math.max(20, cols), rows: Math.max(15, rows) })
      }
    }

    updateGridSize()
    return () => window.removeEventListener("resize", updateGridSize)
  }, [])

  const generateFood = useCallback(
    (snake: Position[]): Position => {
      let newFood: Position
      do {
        newFood = {
          x: Math.floor(Math.random() * gridSize.cols),
          y: Math.floor(Math.random() * gridSize.rows),
        }
      } while (snake.some((segment) => segment.x === newFood.x && segment.y === newFood.y))
      return newFood
    },
    [gridSize],
  )

  const showRandomMessage = useCallback(() => {
    const randomMessage = MESSAGES[Math.floor(Math.random() * MESSAGES.length)]
    setMessage(randomMessage)
    setShowMessage(true)
    setTimeout(() => setShowMessage(false), 1500)
  }, [])

  const addParticles = useCallback((x: number, y: number) => {
    if (particleCleanupRef.current) {
      clearTimeout(particleCleanupRef.current)
    }

    const newParticles = Array.from({ length: 8 }, (_, i) => ({
      x: x * CELL_SIZE + CELL_SIZE / 2,
      y: y * CELL_SIZE + CELL_SIZE / 2,
      id: particleIdCounter++,
    }))
    setParticles((prev) => [...prev, ...newParticles])
    particleCleanupRef.current = setTimeout(() => {
      setParticles((prev) => prev.filter((p) => !newParticles.some((np) => np.id === p.id)))
      particleCleanupRef.current = null
    }, 1000)
  }, [])

  const resetGame = useCallback(() => {
    const initialSnake = [{ x: Math.floor(gridSize.cols / 2), y: Math.floor(gridSize.rows / 2) }]
    gameStartTimeRef.current = 0
    countdownRef.current = 3
    setGameState((prev) => ({
      ...prev,
      snake: initialSnake,
      food: generateFood(initialSnake),
      direction: "RIGHT",
      score: 0,
      isGameOver: false,
      liberatedComputers: 0,
      countdown: 3,
    }))
    playSound(440, 0.1)
  }, [generateFood, gridSize, playSound])

  const updateLeaderboard = useCallback(
    (score: number) => {
      const newLeaderboard = [...leaderboard, score].sort((a, b) => b - a).slice(0, 5)
      setLeaderboard(newLeaderboard)
      localStorage.setItem("nirdSnakeLeaderboard", JSON.stringify(newLeaderboard))
    },
    [leaderboard],
  )

  useEffect(() => {
    const config = GAME_CONFIG[gameState.difficulty]
    setGridSize({ cols: config.gridCols, rows: config.gridRows })
  }, [gameState.difficulty])

  const gameLoop = useCallback(
    (timestamp: number) => {
      const speed = GAME_CONFIG[gameState.difficulty].speed

      if (gameStartTimeRef.current === 0 && !gameState.isGameOver) {
        gameStartTimeRef.current = timestamp
        countdownRef.current = 3
      }

      if (gameStartTimeRef.current > 0) {
        const elapsed = timestamp - gameStartTimeRef.current
        const newCountdown = Math.max(0, 3 - Math.floor(elapsed / 1000))

        countdownRef.current = newCountdown
        if (newCountdown !== gameState.countdown) {
          setGameState((prev) => ({
            ...prev,
            countdown: newCountdown,
          }))
        }

        if (countdownRef.current > 0) {
          animationFrameRef.current = requestAnimationFrame(gameLoop)
          return
        }
      }

      if (timestamp - lastUpdateRef.current >= speed) {
        lastUpdateRef.current = timestamp

        movementCounterRef.current++

        const direction = nextDirectionRef.current
        const head = gameState.snake[0]
        let newHead: Position

        switch (direction) {
          case "UP":
            newHead = { x: head.x, y: head.y - 1 }
            break
          case "DOWN":
            newHead = { x: head.x, y: head.y + 1 }
            break
          case "LEFT":
            newHead = { x: head.x - 1, y: head.y }
            break
          case "RIGHT":
            newHead = { x: head.x + 1, y: head.y }
            break
        }

        if (gameState.isGameOver) {
          return
        }

        if (newHead.x < 0 || newHead.x >= gridSize.cols || newHead.y < 0 || newHead.y >= gridSize.rows) {
          playSound(150, 0.3, "sawtooth")
          updateLeaderboard(gameState.score)
          setGameState((prev) => ({ ...prev, isGameOver: true }))
          return
        }

        if (gameState.snake.some((segment) => segment.x === newHead.x && segment.y === newHead.y)) {
          playSound(150, 0.3, "sawtooth")
          updateLeaderboard(gameState.score)
          setGameState((prev) => ({ ...prev, isGameOver: true }))
          return
        }

        const newSnake = [newHead, ...gameState.snake]

        if (newHead.x === gameState.food.x && newHead.y === gameState.food.y) {
          const newScore = gameState.score + 10
          const newHighScore = Math.max(newScore, gameState.highScore)
          const newLiberatedComputers = gameState.liberatedComputers + 1

          if (newHighScore > gameState.highScore) {
            localStorage.setItem("nirdSnakeHighScore", newHighScore.toString())
          }

          playSound(880, 0.1)
          addParticles(gameState.food.x, gameState.food.y)

          if (newScore % 50 === 0) {
            showRandomMessage()
          }

          const targetScore = GAME_CONFIG[gameState.difficulty].targetScore
          if (newScore >= targetScore) {
            playSound(1200, 0.2)
            updateLeaderboard(newScore)
            setGameState((prev) => ({
              ...prev,
              snake: newSnake,
              food: generateFood(newSnake),
              score: newScore,
              highScore: newHighScore,
              liberatedComputers: newLiberatedComputers,
              isGameOver: true,
            }))
            return
          }

          setGameState((prev) => ({
            ...prev,
            snake: newSnake,
            food: generateFood(newSnake),
            score: newScore,
            highScore: newHighScore,
            liberatedComputers: newLiberatedComputers,
            direction: direction,
          }))
        } else {
          newSnake.pop()
          setGameState((prev) => ({ ...prev, snake: newSnake, direction }))
        }
      }

      animationFrameRef.current = requestAnimationFrame(gameLoop)
    },
    [gameState, generateFood, playSound, addParticles, showRandomMessage, updateLeaderboard],
  )

  useEffect(() => {
    if (gameState.isGameOver) return

    animationFrameRef.current = requestAnimationFrame(gameLoop)

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [gameState])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const width = gridSize.cols * CELL_SIZE
    const height = gridSize.rows * CELL_SIZE

    canvas.width = width
    canvas.height = height

    const gradient = ctx.createLinearGradient(0, 0, width, height)
    gradient.addColorStop(0, "rgba(5, 10, 25, 1)")
    gradient.addColorStop(0.5, "rgba(10, 20, 40, 1)")
    gradient.addColorStop(1, "rgba(15, 25, 50, 1)")
    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, width, height)

    ctx.strokeStyle = "rgba(255, 165, 0, 0.04)"
    ctx.lineWidth = 1
    for (let i = 0; i <= gridSize.cols; i++) {
      ctx.beginPath()
      ctx.moveTo(i * CELL_SIZE, 0)
      ctx.lineTo(i * CELL_SIZE, height)
      ctx.stroke()
    }
    for (let i = 0; i <= gridSize.rows; i++) {
      ctx.beginPath()
      ctx.moveTo(0, i * CELL_SIZE)
      ctx.lineTo(width, i * CELL_SIZE)
      ctx.stroke()
    }

    gameState.snake.forEach((segment, index) => {
      const isHead = index === 0
      renderPenguin(ctx, {
        x: segment.x,
        y: segment.y,
        direction: gameState.direction,
        isHead,
        index,
        movementCounter: movementCounterRef.current,
      })
    })

    const foodX = gameState.food.x * CELL_SIZE
    const foodY = gameState.food.y * CELL_SIZE
    const pulseScale = 1 + Math.sin(Date.now() / 150) * 0.15

    ctx.shadowBlur = 25
    ctx.shadowColor = "#f97316"

    const foodGradient = ctx.createRadialGradient(
      foodX + CELL_SIZE / 2,
      foodY + CELL_SIZE / 2,
      0,
      foodX + CELL_SIZE / 2,
      foodY + CELL_SIZE / 2,
      (CELL_SIZE / 2) * pulseScale,
    )
    foodGradient.addColorStop(0, "#fef3c7")
    foodGradient.addColorStop(0.3, "#fbbf24")
    foodGradient.addColorStop(0.6, "#f97316")
    foodGradient.addColorStop(1, "#ea580c")

    ctx.fillStyle = foodGradient
    ctx.beginPath()
    ctx.arc(foodX + CELL_SIZE / 2, foodY + CELL_SIZE / 2, (CELL_SIZE / 2 - 2) * pulseScale, 0, Math.PI * 2)
    ctx.fill()

    ctx.shadowBlur = 0
    ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
    ctx.beginPath()
    ctx.ellipse(foodX + CELL_SIZE / 2, foodY + CELL_SIZE / 2 + 1, 4, 5, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = "rgba(255, 255, 255, 0.9)"
    ctx.beginPath()
    ctx.ellipse(foodX + CELL_SIZE / 2, foodY + CELL_SIZE / 2 + 2, 2, 3, 0, 0, Math.PI * 2)
    ctx.fill()
  }, [gameState.snake, gameState.food, gameState.direction, gridSize])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose()
        return
      }

      if (e.key.toLowerCase() === "r" && gameState.isGameOver) {
        resetGame()
        return
      }

      const directionMap: Record<string, Direction> = {
        ArrowUp: "UP",
        ArrowDown: "DOWN",
        ArrowLeft: "LEFT",
        ArrowRight: "RIGHT",
        w: "UP",
        W: "UP",
        s: "DOWN",
        S: "DOWN",
        a: "LEFT",
        A: "LEFT",
        d: "RIGHT",
        D: "RIGHT",
      }

      const newDirection = directionMap[e.key]
      if (!newDirection) return

      const now = Date.now()
      const speed = GAME_CONFIG[gameState.difficulty].speed

      const opposites: Record<Direction, Direction> = {
        UP: "DOWN",
        DOWN: "UP",
        LEFT: "RIGHT",
        RIGHT: "LEFT",
      }

      if (opposites[gameState.direction] !== newDirection && now - lastDirectionChangeRef.current >= speed * 0.25) {
        nextDirectionRef.current = newDirection
        lastDirectionChangeRef.current = now
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [onClose, resetGame, gameState.isGameOver, gameState.difficulty, gameState.direction])

  useEffect(() => {
    return () => {
      if (particleCleanupRef.current) {
        clearTimeout(particleCleanupRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-background/95 backdrop-blur-md"
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 20 }).map((_, i) => (
          <div
            key={i}
            className="absolute h-1 w-1 animate-pulse rounded-full bg-primary/20"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 2}s`,
              animationDuration: `${2 + Math.random() * 3}s`,
            }}
          />
        ))}
      </div>

      <GameUI
        score={gameState.score}
        highScore={gameState.highScore}
        difficulty={gameState.difficulty}
        soundEnabled={soundEnabled}
        isPaused={false}
        onDifficultyChange={(d) => setGameState((prev) => ({ ...prev, difficulty: d }))}
        onSoundToggle={() => setSoundEnabled((prev) => !prev)}
        onClose={onClose}
        leaderboard={leaderboard}
        liberatedComputers={gameState.liberatedComputers}
      />

      <div className="relative">
        <canvas
          ref={canvasRef}
          className="rounded-xl border-2 border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.2)]"
        />

        <Particles particles={particles} />

        {gameState.countdown > 0 && !gameState.isGameOver && (
          <div className="animate-in fade-in absolute inset-0 flex items-center justify-center rounded-xl bg-background/60 backdrop-blur-md duration-200">
            <div className="text-6xl font-bold text-green-400">{gameState.countdown}</div>
          </div>
        )}

        {showMessage && (
          <div className="absolute inset-0 flex items-center justify-center duration-200 animate-in fade-in">
            <div className="rounded-full bg-green-500/20 px-6 py-3 text-xl font-bold text-green-400 backdrop-blur-sm">
              {message}
            </div>
          </div>
        )}

        {gameState.isGameOver && (
          <div className="animate-in fade-in absolute inset-0 flex flex-col items-center justify-center rounded-xl bg-background/80 backdrop-blur-sm duration-300">
            {gameState.score >= GAME_CONFIG[gameState.difficulty].targetScore ? (
              <>
                <h2
                  className={`mb-2 font-bold text-green-400 text-balance ${gameState.difficulty === "débutant" ? "text-2xl" : "text-4xl"}`}
                >
                  Vous avez gagné ! 🐧
                </h2>
                <p
                  className={`mb-2 text-foreground/80 ${gameState.difficulty === "débutant" ? "text-base" : "text-xl"}`}
                >
                  Score: <span className="font-mono text-green-400">{gameState.score}</span>
                </p>
                <p className={`mb-4 text-green-300 ${gameState.difficulty === "débutant" ? "text-sm" : "text-lg"}`}>
                  Tous les ordinateurs sont libérés de Windows !
                </p>
              </>
            ) : (
              <>
                <h2
                  className={`mb-2 font-bold text-orange-400 text-balance ${gameState.difficulty === "débutant" ? "text-2xl max-w-md" : "text-4xl max-w-xs"}`}
                >
                  Windows a gagné...
                </h2>
                <p
                  className={`mb-2 text-foreground/80 ${gameState.difficulty === "débutant" ? "text-base" : "text-xl"}`}
                >
                  Score: <span className="font-mono text-green-400">{gameState.score}</span>
                </p>
              </>
            )}
            <p className={`mb-4 text-muted-foreground ${gameState.difficulty === "débutant" ? "text-sm" : "text-lg"}`}>
              🐧 {gameState.liberatedComputers} ordinateur{gameState.liberatedComputers > 1 ? "s" : ""} libéré
              {gameState.liberatedComputers > 1 ? "s" : ""} de l'obsolescence !
            </p>
            <p
              className={`mb-6 text-muted-foreground ${gameState.difficulty === "débutant" ? "text-xs" : "text-base"}`}
            >
              Appuie sur{" "}
              <kbd className="rounded bg-secondary px-2 py-1 font-mono text-secondary-foreground">
                {gameState.difficulty === "débutant" ? "R" : "R"}
              </kbd>{" "}
              pour résister à nouveau
            </p>
            <button
              onClick={resetGame}
              className={`rounded-lg bg-green-600 font-semibold text-white transition-all hover:scale-105 hover:bg-green-500 ${gameState.difficulty === "débutant" ? "px-4 py-2 text-sm" : "px-6 py-3"}`}
            >
              Résister encore !
            </button>
          </div>
        )}
      </div>

      <div className="mt-4 text-center text-sm text-muted-foreground">
        <p>
          <kbd className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground">↑↓←→</kbd> ou{" "}
          <kbd className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground">WASD</kbd> pour
          diriger •{" "}
          <kbd className="rounded bg-secondary px-2 py-0.5 font-mono text-xs text-secondary-foreground">Esc</kbd> fermer
        </p>
      </div>
    </div>
  )
}
