import { get, insert, update } from "./db.js"

export const latestGame = async () => {
  const num = await get("latest_game")
  if (!num) {
    await insert({ _id: "latest_game", game_id: 0 })
  }
  const { game_id } = await get("latest_game") as any
  return game_id
}

export const gamePlus = async () => {
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
      draw_num: 0,
      max: 0,
      prize_list: [],
    })
  }
  const { game_state, draw_num, max, prize_list } = await get(game_id) as any
  return {
    game_id,
    game_state,
    draw_num,
    max,
    prize_list,
  }
}

export const setGameState = async (game_id: string,
  state: string,
  max: number,
  prize_list: any,
) => {
  await update(game_id, {
    game_state: state,
    draw_num: 0,
    max,
    prize_list,
  })
}

export const joinGame = async (game_id: string, address: string) => {
  const address_list = await get(`User/${game_id}`) as any
  // length of address_list.joined is the number of users joined
  if (!address_list) {
    await insert({
      _id: game_id,
      joined: [address],
    })
    return 0
  } else {
    await update(`User/${game_id}`, {
      joined: [...address_list.joined, address],
    })
    return address_list.joined.length
  }
}

export const getJoined = async (game_id: string) => {
  const { joined } = await get(`User/${game_id}`) as any
  return joined
}
const getPermutations = (array: number[]): number[][] => {
  const results = []

  if (array.length === 1) {
    results.push(array)
    return results
  }

  for (let i = 0; i < array.length; i++) {
    const firstChar = array[i]
    const charsLeft = [...array.slice(0, i), ...array.slice(i + 1)]
    const innerPermutations = getPermutations(charsLeft)
    for (let j = 0; j < innerPermutations.length; j++) {
      results.push([firstChar, ...innerPermutations[j]])
    }
  }
  return results
}
export const getAnswer = async (game_id: string) => {
  const { result } = await get(`result/${game_id}`) as any
  const { joined } = await get(`User/${game_id}`) as any
  const joined_num = joined.length
  const random = result % joined_num

  // 取 joined_num 階層的答案

  if (!result) {
    return []
  }
  const answer = getPermutations([...Array(joined_num).keys()])
  return answer[random]
}
