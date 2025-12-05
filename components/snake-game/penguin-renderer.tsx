"use client"

import { CELL_SIZE } from "./constants"

type Direction = "UP" | "DOWN" | "LEFT" | "RIGHT"

interface PenguinRendererProps {
  x: number
  y: number
  direction: Direction
  isHead: boolean
  index: number
  movementCounter: number
}

// Cache for loaded images
const imageCache: Record<string, HTMLImageElement> = {}
const imageLoadingPromises: Record<string, Promise<HTMLImageElement>> = {}

function preloadImage(src: string): Promise<HTMLImageElement> {
  if (imageCache[src]) {
    return Promise.resolve(imageCache[src])
  }

  if (imageLoadingPromises[src]) {
    return imageLoadingPromises[src]
  }

  const promise = new Promise<HTMLImageElement>((resolve) => {
    const img = new Image()
    img.crossOrigin = "anonymous"
    img.onload = () => {
      imageCache[src] = img
      resolve(img)
    }
    img.onerror = () => {
      resolve(img)
    }
    img.src = src
  })

  imageLoadingPromises[src] = promise
  return promise
}

preloadImage("/penguin1.png")
preloadImage("/penguin1-reverse.png")
preloadImage("/penguin2.png")
preloadImage("/penguin2-reverse.png")
preloadImage("/penguin3.png")
preloadImage("/penguin4.png")

export function renderPenguin(ctx: CanvasRenderingContext2D, props: PenguinRendererProps) {
  const { x, y, direction, isHead, index, movementCounter } = props

  if (!isHead) {
    const cellX = x * CELL_SIZE
    const cellY = y * CELL_SIZE
    const centerX = cellX + CELL_SIZE / 2
    const centerY = cellY + CELL_SIZE / 2

    ctx.save()
    ctx.translate(centerX, centerY)

    const rotations: Record<Direction, number> = {
      RIGHT: 0,
      DOWN: Math.PI / 2,
      LEFT: Math.PI,
      UP: (Math.PI * 3) / 2,
    }
    ctx.rotate(rotations[direction])

    const alpha = Math.max(0.3, 1 - index * 0.08)
    ctx.fillStyle = `rgba(0, 0, 0, ${alpha})`
    ctx.beginPath()
    ctx.ellipse(0, 0, 6, 8, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = `rgba(255, 255, 255, ${alpha * 0.9})`
    ctx.beginPath()
    ctx.ellipse(0, 2, 4, 6, 0, 0, Math.PI * 2)
    ctx.fill()

    ctx.fillStyle = `rgba(50, 50, 50, ${alpha * 0.7})`
    ctx.beginPath()
    ctx.arc(0, -6, 2, 0, Math.PI * 2)
    ctx.fill()

    ctx.restore()
    return
  }

  const cellX = x * CELL_SIZE
  const cellY = y * CELL_SIZE
  const centerX = cellX + CELL_SIZE / 2
  const centerY = cellY + CELL_SIZE / 2

  let imagePath = "/penguin1.png"
  let size = CELL_SIZE * 2

  if (direction === "DOWN") {
    imagePath = movementCounter % 2 === 0 ? "/penguin1.png" : "/penguin1-reverse.png"
  } else if (direction === "UP") {
    imagePath = movementCounter % 2 === 0 ? "/penguin2.png" : "/penguin2-reverse.png"
    if (imagePath === "/penguin2.png") {
      size = CELL_SIZE * 4
    }
  } else if (direction === "RIGHT") {
    imagePath = movementCounter % 2 === 0 ? "/penguin3.png" : "/penguin4.png"
    if (imagePath === "/penguin3.png") {
      size = CELL_SIZE * 4
    }
  } else if (direction === "LEFT") {
    imagePath = movementCounter % 2 === 0 ? "/penguin3.png" : "/penguin4.png"
    if (imagePath === "/penguin3.png") {
      size = CELL_SIZE * 4
    }
  }

  const img = imageCache[imagePath]
  if (!img) {
    return
  }

  ctx.save()
  ctx.translate(centerX, centerY)

  if (direction === "LEFT") {
    ctx.scale(-1, 1)
  }

  ctx.drawImage(img, -size / 2, -size / 2, size, size)

  ctx.restore()
}
