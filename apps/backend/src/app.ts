import express from "express"
import cors from "cors"
import { UserKey, setPK, shuffle, decrypt, reset } from "./services/mina.js"
import { gameState, getAnswer, joinGame, latestGame, setGameState } from "./services/game.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/test", async (req, res) => {
  await setPK()
  await shuffle(2)
  await shuffle(3)
  await shuffle(5)
  await decrypt("999")
  await reset()
  res.json({ done: true })
})
// get latest game id
app.get("/latest_game", async (req, res) => {
  const latest_game = await latestGame()
  const state = {
    game_id: latest_game,
  }
  res.json(state)
})
// get game state
app.get("/get_game/:id", async (req, res) => {
  const id = req.params.id

  const state = await gameState(id)
  res.json(state)
})

app.post("/get_game_user/:id", async (req, res) => {
  const id = req.params.id
  const address = req.body.user_address

  const state = {
    game_id: id,
    joined: true,
  }

  res.json(state)
})
app.post("/draw/:id", async (req, res) => {
  const id = req.params.id
  const address = req.body.user_address
  const random = req.body.shuffle_number

  await shuffle(Number(random))
  const num = await joinGame(id, address)

  const state = {
    draw_count: num,
    result: true,
  }
  res.json(state)
})

app.post("/reveal/:id", async (req, res) => {
  const id = req.params.id
  const address = req.body.user_address
  const payment = req.body.payment
  const state = {
    game_id: id,
    result: [],
  }
  res.json(state)
})

app.post("/setgame", async (req, res) => {
  const max = req.body.max
  const prize_list = req.body.prize_list
  const game_id = req.body.game_id
  await setGameState(game_id, "start", max, prize_list)

  const pk = await setPK()
  res.json({ message: "Set", pk: pk })
})

app.get("/decrypt/:id", async (req, res) => {
  const id = req.params.id
  const result = await decrypt(id)
  res.json({ result: result })
})

app.post("/user/:address", async (req, res) => {
  const address = req.params.address

  const userKey = await UserKey(address)
  const userData = {
    sign_count: 10,
    mina_wallet: userKey.pub,
    mina_private_key: userKey.key,
  }

  res.json(userData)
})

console.log("Listening on port 8080")
app.listen(8080)
