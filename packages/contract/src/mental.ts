import {
  Field,
  state,
  State,
  method,
  PrivateKey,
  SmartContract,
  Mina,
  AccountUpdate,
  isReady,
  shutdown,
} from "o1js"
import { Cipher, ElGamalFF } from "o1js-elgamal"

const doProofs = true

await isReady

class Mental extends SmartContract {
  @state(Cipher) c1 = State<Cipher>()
  @state(Cipher) ans = State<Cipher>()
  @state(Field) pk = State<Field>()
  @state(Field) result = State<Field>()

  @method setPubKey (pk: Field) {
    this.pk.set(pk)
    this.c1.set(ElGamalFF.encrypt(Field(1), pk))
  }

  // calculate shuffle
  @method shuffleValue (randomValue: Field) {
    const c1 = this.c1.get()
    this.c1.assertEquals(c1)

    const pk = this.pk.get()
    this.pk.assertEquals(pk)

    const product = c1.mul(ElGamalFF.encrypt(randomValue, pk))
    this.ans.set(product)
  }

  @method decrypt (secretKey: Field) {
    const result = this.ans.get()
    this.ans.assertEquals(result)

    const plainText = ElGamalFF.decrypt(result, secretKey)
    this.result.set(plainText as any)
  }
}

// test
const Local = Mina.LocalBlockchain({ proofsEnabled: doProofs })
Mina.setActiveInstance(Local)

// a test account that pays all the fees, and puts additional funds into the zkapp
const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]
const { privateKey: userKey, publicKey: user } = Local.testAccounts[1]

// the zkapp account
const zkappKey = PrivateKey.random()
const zkappAddress = zkappKey.toPublicKey()

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

shutdown()
