import express from "express"
import cors from "cors"
import { UserKey } from "./services/mina.js"

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/game/:id", async (req, res) => {
  const id = req.params.id

  const state = {
    join_count: 10,
    state: 0,
    max: 10,
    c: process.env.COUCHDB_PASSWORD || "pass",
  }

  res.json(state)
})

app.post("/setgame", async (req, res) => {
  const state = req.body.state

  res.json({ message: "Set" })
})

app.post("/join/:id", async (req, res) => {
  const id = req.params.id
  const address = req.body.address

  res.json({ message: "Joined", b: process.env.COUCHDB_PASSWORD })
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