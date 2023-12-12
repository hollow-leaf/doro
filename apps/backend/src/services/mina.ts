import { Mina, PrivateKey, Field, AccountUpdate } from "o1js"
import { get, insert, update } from "./db.js"
import { Mental } from "../contract/mental.js"
import { ElGamalFF } from "o1js-elgamal"
// import
const GenerateKey = () => {
  const key = PrivateKey.random()
  return key
}
let isCompiled = false
let isDeployed = false
const Local = Mina.LocalBlockchain({ proofsEnabled: true })
Mina.setActiveInstance(Local)
const zkappKey = PrivateKey.random()
const zkappAddress = zkappKey.toPublicKey()
const zkapp = new Mental(zkappAddress)

const setNetwork = async (local: boolean) => {
  if (!isCompiled) {
    console.log("compiling...")
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
    console.log("deployed")
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
  await setNetwork(true)

  const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]

  const { pk, sk } = ElGamalFF.generateKeys()
  console.log(pk.toBigInt())
  await update("sk", { sk: sk.toBigInt().toString() })
  // await update({
  //   _id: "pk",
  //   pub: pk.toString(),
  //   key: sk.,
  // })
  const tx = await Mina.transaction({ sender, fee: 0.1 * 1e9 }, () => {
    zkapp.setPubKey(pk)
  })
  await tx.prove()
  await tx.sign([senderKey]).send()

  console.log(zkapp.pk.get())
}

export const shuffle = async (randomValue: number) => {
  await setNetwork(true)

  const { privateKey: userKey, publicKey: user } = await Local.testAccounts[1]
  const tx = await Mina.transaction({ sender: user, fee: 0.1 * 1e9 }, () => {
    zkapp.shuffleValue(Field(randomValue))
  })
  await tx.prove()
  await tx.sign([userKey]).send()
  console.log("go")
}

export const decrypt = async () => {
  await setNetwork(true)
  console.log("decrypting...")
  const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]

  const { sk } = await get("sk") as any

  console.log(sk)
  console.log(Field(Number(sk)))
  const tx = await Mina.transaction({ sender: sender, fee: 0.1 * 1e9 }, () => {
    zkapp.decrypt(Field(sk))
  })
  await tx.prove()
  await tx.sign([senderKey]).send()

  console.log(zkapp.result.get())
}
