// import { Mina, PrivateKey, Field, AccountUpdate } from "o1js"

// let isCompiled = false
// let isDeployed = false

// const GenerateKey = () => {
//   const key = PrivateKey.random()
//   return key
// }

// const GenerateElagmalKey = () => {
//   const { pk, sk } = ElGamalFF.generateKeys()
//   return { pk, sk }
// }

// // user use their own key to encrypt their number
// export const setPK = async () => {
//   await setNetwork()

//   const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]

//   const { pk, sk } = ElGamalFF.generateKeys()
//   console.log("ElGamal Public Key", pk.toString())
//   await update("sk", { sk: sk.toBigInt().toString(), pk: pk.toBigInt().toString() })
//   const tx = await Mina.transaction({ sender, fee: 0.1 * 1e9 }, () => {
//     zkapp.setPubKey(pk)
//   })
//   await tx.prove()
//   await tx.sign([senderKey]).send()

//   console.log("Set ElGamal Public Key to zkapp")
//   const epk = zkapp.pk.get()
//   return epk.toBigInt().toString()
// }

// export const shuffle = async (randomValue: number) => {
//   const { privateKey: userKey, publicKey: user } = await Local.testAccounts[1]
//   console.log("Shuffling...")
//   const tx = await Mina.transaction({ sender: user, fee: 0.1 * 1e9 }, () => {
//     zkapp.shuffleValue(Field(randomValue))
//   })
//   await tx.prove()
//   await tx.sign([userKey]).send()
//   console.log("Shuffled")
// }

// export const decrypt = async (game_id: string) => {
//   console.log("Decrypting...")
//   const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]

//   const { sk } = await get("sk") as any

//   const tx = await Mina.transaction({ sender: sender, fee: 0.1 * 1e9 }, () => {
//     zkapp.decrypt(Field(sk))
//   })
//   await tx.prove()
//   await tx.sign([senderKey]).send()

//   const result = zkapp.result.get().toBigInt().toString()
//   console.log("Decrypted Result:", result)
//   await update(`result/${game_id}`, { result: result })
//   return result
// }

// export const reset = async () => {
//   await setNetwork()

//   const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]
//   const tx = await Mina.transaction({ sender: sender, fee: 0.1 * 1e9 }, () => {
//     zkapp.reset()
//   })
//   await tx.prove()
//   await tx.sign([senderKey]).send()
//   console.log("End Game")
// }
