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

// Test accounts
const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]
const { privateKey: userKey, publicKey: user } = Local.testAccounts[1]

// zkApp account
const zkappKey = PrivateKey.random()
const zkappAddress = zkappKey.toPublicKey()

console.log("ZkApp Address:", zkappAddress)

// Instantiate zkApp contract
const zkapp = new Mental(zkappAddress)
const { pk, sk } = ElGamalFF.generateKeys()

await Mental.compile()

// Deploy zkApp and set public key
console.log("Admin")
let tx = await Mina.transaction(sender, () => {
  AccountUpdate.fundNewAccount(sender)
  zkapp.deploy({ zkappKey })
})
await tx.prove()
await tx.sign([senderKey]).send()

console.log("Set Public Key")
tx = await Mina.transaction(sender, () => {
  zkapp.setPubKey(pk)
})
await tx.prove()
await tx.sign([senderKey]).send()

// User shuffles
console.log("User Shuffle")
tx = await Mina.transaction(user, () => {
  const randomValue = Math.floor(Math.random() * 10) + 1
  zkapp.shuffleValue(Field(randomValue))
})
await tx.prove()
await tx.sign([userKey]).send()

// Decrypt
console.log("Decrypt")
tx = await Mina.transaction(sender, () => {
  zkapp.decrypt(sk)
})
await tx.prove()
await tx.sign([senderKey]).send()

console.log("Result after decryption:", zkapp.result.get())

// Reset
console.log("Reset")
tx = await Mina.transaction(sender, () => {
  zkapp.reset()
})
await tx.prove()
await tx.sign([senderKey]).send()

console.log("Result after reset:", zkapp.result.get())

shutdown()
