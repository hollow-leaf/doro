import { Mina, PrivateKey, Field, AccountUpdate } from "o1js"
import { get, insert, update } from "./db.js"
import { Mental } from "../contract/mental.js"
import { ElGamalFF } from "o1js-elgamal"
// import
let isCompiled = false
let isDeployed = false
const Local = Mina.LocalBlockchain({ proofsEnabled: true })
Mina.setActiveInstance(Local)
const zkappKey = PrivateKey.random()
const zkappAddress = zkappKey.toPublicKey()
const zkapp = new Mental(zkappAddress)

const GenerateKey = () => {
  const key = PrivateKey.random()
  return key
}

const setNetwork = async () => {
  if (!isCompiled) {
    console.log("compiling contract...")
    await Mental.compile()
    isCompiled = true
  }
  if (!isDeployed) {
    console.log("deploying...")
    const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]
    const tx = await Mina.transaction(sender, () => {
      AccountUpdate.fundNewAccount(sender)
      zkapp.deploy({ zkappKey })
    })
    await tx.prove()
    await tx.sign([senderKey]).send()
    isDeployed = true
    console.log(`zkapp deployed at ${zkappAddress.toBase58()}`)
  }
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

export const setPK = async () => {
  await setNetwork()

  const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]

  const { pk, sk } = ElGamalFF.generateKeys()
  console.log("ElGamal Public Key", pk.toString())
  await update("sk", { sk: sk.toBigInt().toString(), pk: pk.toBigInt().toString() })
  const tx = await Mina.transaction({ sender, fee: 0.1 * 1e9 }, () => {
    zkapp.setPubKey(pk)
  })
  await tx.prove()
  await tx.sign([senderKey]).send()

  console.log("Set ElGamal Public Key to zkapp")
  const epk = zkapp.pk.get()
  return epk.toBigInt().toString()
}

export const shuffle = async (randomValue: number) => {
  await setNetwork()

  const { privateKey: userKey, publicKey: user } = await Local.testAccounts[1]
  console.log("Shuffling...")
  const tx = await Mina.transaction({ sender: user, fee: 0.1 * 1e9 }, () => {
    zkapp.shuffleValue(Field(randomValue))
  })
  await tx.prove()
  await tx.sign([userKey]).send()
  console.log("Shuffled")
}

export const decrypt = async (game_id: string) => {
  await setNetwork()

  console.log("Decrypting...")
  const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]

  const { sk } = await get("sk") as any

  const tx = await Mina.transaction({ sender: sender, fee: 0.1 * 1e9 }, () => {
    zkapp.decrypt(Field(sk))
  })
  await tx.prove()
  await tx.sign([senderKey]).send()

  const result = zkapp.result.get().toBigInt().toString()
  console.log("Decrypted Result:", result)
  await update(`result/${game_id}`, { result: result })
  return result
}

export const reset = async () => {
  await setNetwork()

  const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]
  const tx = await Mina.transaction({ sender: sender, fee: 0.1 * 1e9 }, () => {
    zkapp.reset()
  })
  await tx.prove()
  await tx.sign([senderKey]).send()
  console.log("End Game")
}
