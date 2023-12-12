import { Mina, PrivateKey, PublicKey, AccountUpdate } from "o1js"
import { get, insert } from "./db.js"
import { Mental } from "../contract/mental.js"
import { ElGamalFF } from "o1js-elgamal"
// import
const GenerateKey = () => {
  const key = PrivateKey.random()
  return key
}
let isCompiled = false
const setNetwork = async () => {
  const Berkeley = Mina.Network(
    "https://proxy.berkeley.minaexplorer.com/graphql",
  )
  Mina.setActiveInstance(Berkeley)
  if (!isCompiled) {
    console.log("compiling...")
    await Mental.compile()
    isCompiled = true
  }
}

const setTestAccount = () => {
  const key = PrivateKey.fromBase58("EKERrsjtN4us8y9Y2Q3EDFKAju8rkKRynGFmybkG7Ufd6MMvPRbL")
  return {
    privateKey: key,
    publicKey: key.toPublicKey(),
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

export const contractInteract = async () => {
  await setNetwork()

  const { privateKey: senderKey, publicKey: sender } = setTestAccount()
  console.log(sender.toBase58())

  const contractAddr = PublicKey.fromBase58("B62qrmRifvNnkRaKqw62Z84JGS5dn6cAgvZtLXsDpRLRH4zrxjLhCti")
  const zkapp = new Mental(contractAddr)

  await Mental.compile()
  console.log(zkapp)
  const { pk, sk } = ElGamalFF.generateKeys()
  const tx = await Mina.transaction({ sender, fee: 0.1 * 1e9 }, () => {
    zkapp.setPubKey(pk)
  })
  await tx.prove()
  await tx.sign([senderKey]).send()

  console.log(zkapp.pk.get())
}
