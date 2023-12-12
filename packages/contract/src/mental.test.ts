import {
  Field,
  PrivateKey,
  Mina,
  AccountUpdate,
  isReady,
  shutdown,
} from "o1js"
import { ElGamalFF } from "o1js-elgamal"
import { Mental } from "./mental.js"

const doProofs = true

await isReady
// test
const Local = Mina.LocalBlockchain({ proofsEnabled: doProofs })
Mina.setActiveInstance(Local)

// a test account that pays all the fees, and puts additional funds into the zkapp
const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]
const { privateKey: userKey, publicKey: user } = Local.testAccounts[1]

// the zkapp account
const zkappKey = PrivateKey.random()
const zkappAddress = zkappKey.toPublicKey()

console.log(zkappAddress)
const zkapp = new Mental(zkappAddress)
const { pk, sk } = ElGamalFF.generateKeys()

await Mental.compile()

console.log("Admin")
let tx = await Mina.transaction(sender, () => {
  AccountUpdate.fundNewAccount(sender)
  zkapp.deploy({ zkappKey })
})
await tx.prove()
await tx.sign([senderKey]).send()

console.log("set Public Key")
tx = await Mina.transaction(sender, () => {
  zkapp.setPubKey(pk)
})
await tx.prove()
await tx.sign([senderKey]).send()

console.log("User Shuffle")
tx = await Mina.transaction(user, () => {
  const randomValue = Math.floor(Math.random() * 10) + 1
  zkapp.shuffleValue(Field(randomValue))
})
await tx.prove()
await tx.sign([userKey]).send()

console.log("decrypt")
tx = await Mina.transaction(sender, () => {
  zkapp.decrypt(sk)
})
await tx.prove()
await tx.sign([senderKey]).send()

console.log(zkapp.result.get())
// zkapp.result.get().assertEquals(2)

console.log("reset")
tx = await Mina.transaction(sender, () => {
  zkapp.reset()
})
await tx.prove()
await tx.sign([senderKey]).send()

console.log(zkapp.result.get())
shutdown()
