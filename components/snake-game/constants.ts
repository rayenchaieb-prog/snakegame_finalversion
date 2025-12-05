export const CELL_SIZE = 20

export const GAME_CONFIG = {
  débutant: {
    gridCols: 20,
    gridRows: 20,
    speed: 200, // milliseconds between moves
    targetScore: 200, // 20 food items to win
  },
  expert: {
    gridCols: 15,
    gridRows: 15,
    speed: 120, // 80ms faster than débutant for more challenge
    targetScore: 400, // 40 food items to win
  },
}
