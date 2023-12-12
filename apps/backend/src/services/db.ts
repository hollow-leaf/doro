import nano from "nano"

interface CouchdbConfigType {user: string; password: string; host: string; port?: number}

const dbConfig = async (config: CouchdbConfigType) => {
  const db = nano(`http://${config.user}:${config.password}@${config.host}:${config.port || 5984}`)
  // try use db, if not exist, create it and return it
  try {
    await db.db.get("game")
  } catch (error) {
    await db.db.create("game")
  }
  return db.use("game")
}

export const getCouchdb = () => {
  const couchdb = dbConfig({
    user: process.env.COUCHDB_USER || "admin",
    password: process.env.COUCHDB_PASSWORD || "password",
    host: process.env.COUCHDB_URL || "localhost",
    port: 5984,
  })
  return couchdb
}

export const insert = async (data: any) => {
  const db = await getCouchdb()
  try {
    await db.insert(data)
  } catch (error) {
    console.log(error)
  }
}

export const get = async (id: string) => {
  const db = await getCouchdb()
  try {
    return await db.get(id)
  } catch (error) {
    return null
  }
}

export const update = async (id: string, data: any) => {
  const db = await getCouchdb()
  try {
    const doc = await db.get(id)
    await db.insert({ ...doc, ...data })
  } catch (error) {
    await insert({ _id: id, ...data })
  }
}
