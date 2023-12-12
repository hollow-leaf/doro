import { get, insert, update } from "./db.js"

export const latestGame = async () => {
  const num = await get("latest_game")
  if (!num) {
    await insert({ _id: "latest_game", game_id: 0 })
  }
  const { game_id } = await get("latest_game") as any
  return game_id
}

const gamePlus = async () => {
  const { game_id } = await get("latest_game") as any
  await update("latest_game", {
    game_id: game_id + 1,
  })
}

export const gameState = async (game_id: string) => {
  const game = await get(game_id)
  if (!game) {
    await insert({
      _id: game_id,
      game_state: "not_start",
      draw_count: 0,
      max: 0,
      prize_list: [],
    })
  }
  const { game_state, draw_count, max, prize_list } = await get(game_id) as any
  return {
    game_id,
    game_state,
    draw_count,
    max,
    prize_list,
  }
}
