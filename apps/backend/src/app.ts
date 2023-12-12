import express from "express"
import cors from "cors"
import { UserKey } from "./services/mina.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/latest_game", async (req, res) => {
  const state = {
    game_id: 1,
  }
  res.json(state)
})

app.get("/get_game/:id", async (req, res) => {
  const id = req.params.id

  const state = {
    game_id: id,
    game_state: "draw",
    draw_count: 3,
    max: 10,
    prize_list: [],
  }

  res.json(state)
})

app.get("/get_game_user/:id", async (req, res) => {
  const id = req.params.id
  const address = req.body.user_address

  const state = {
    game_id: id,
    joined: true,
  }

  res.json(state)
})

app.post("/reveal/:id", async (req, res) => {
  const id = req.params.id
  const address = req.body.user_address
  const payment = req.body.payment
  const state = {
    game_id: id,
    result: 0,
  }
  res.json(state)
})

app.post("/setgame", async (req, res) => {
  const state = req.body.state

  res.json({ message: "Set" })
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
