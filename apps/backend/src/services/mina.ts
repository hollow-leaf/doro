import { Mina, PrivateKey } from "o1js"
import { get, insert } from "./db.js"
// import
const GenerateKey = () => {
  const key = PrivateKey.random()
  return key
}

const fromBase58 = (key: string) => {
  const privateKey = PrivateKey.fromBase58(key)
  return privateKey
}

export const UserKey = async (address: string) => {
  // get user key from db, if not exist, generate one
  const user = await get(address)
  if (!user) {
    const key = GenerateKey()
    await insert({
      _id: address,
      pub: key.toPublicKey(),
      key: key.toBase58(),
    })
  }
  const userKey: any = await get(address)
  return { pub: userKey.pub, key: userKey.key }
}
