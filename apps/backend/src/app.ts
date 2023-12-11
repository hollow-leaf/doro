import express from 'express'
import cors from 'cors'
import fs from 'fs'

const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.post('/generate_qrcode', async (req, res) => {

})

app.post('/join', async (req, res) => {

})

app.post('/gen_priv_key', async(req, res) => {
  
})
app.listen(8080)
