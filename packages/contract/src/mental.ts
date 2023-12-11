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
  @state(Cipher) c2 = State<Cipher>()
  @state(Cipher) c3 = State<Cipher>()
  // @state(Cipher)

  @state(Field) result = State<Field>()

  @method encrypt (m1: Field, m2: Field, pk: Field) {
    this.c1.set(ElGamalFF.encrypt(m1, pk))
    this.c2.set(ElGamalFF.encrypt(m2, pk))
  }

  // calculate shuffle
  @method multiplyCipher () {
    const c1 = this.c1.get()
    this.c1.assertEquals(c1)

    const c2 = this.c2.get()
    this.c2.assertEquals(c2)

    const c3 = this.c3.get()
    this.c3.assertEquals(c3)

    const product = c1.mul(c2)
    this.c3.set(product)
  }

  @method decrypt (secretKey: Field) {
    const result = this.c3.get()
    this.c3.assertEquals(result)

    const plainText = ElGamalFF.decrypt(result, secretKey)
    this.result.set(plainText as any)
  }
}

const Local = Mina.LocalBlockchain({ proofsEnabled: doProofs })
Mina.setActiveInstance(Local)

// a test account that pays all the fees, and puts additional funds into the zkapp
const { privateKey: senderKey, publicKey: sender } = Local.testAccounts[0]

// the zkapp account
const zkappKey = PrivateKey.random()
const zkappAddress = zkappKey.toPublicKey()

const zkapp = new Mental(zkappAddress)
// console.log(zkapp)
const { pk, sk } = ElGamalFF.generateKeys()

const m1 = Field(5)
const m2 = Field(10)
console.log(m1)
await Mental.compile()

console.log("deploy")
let tx = await Mina.transaction(sender, () => {
  AccountUpdate.fundNewAccount(sender)
  zkapp.deploy({ zkappKey })
})
await tx.prove()
await tx.sign([senderKey]).send()

console.log("set and encrypt")
tx = await Mina.transaction(sender, () => {
  zkapp.encrypt(m1, m2, pk)
})
await tx.prove()
await tx.sign([senderKey]).send()

console.log("multiply")
tx = await Mina.transaction(sender, () => {
  zkapp.multiplyCipher()
})
await tx.prove()
await tx.sign([senderKey]).send()

console.log("decrypt")
tx = await Mina.transaction(sender, () => {
  zkapp.decrypt(sk)
})
await tx.prove()
await tx.sign([senderKey]).send()

zkapp.result.get().assertEquals(m1.add(m2))

shutdown()
