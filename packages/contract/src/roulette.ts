import {
  Field,
  state,
  State,
  method,
  SmartContract,
} from "o1js"
import { Cipher, ElGamalFF } from "o1js-elgamal"

// a choice make by a player
// roulette is a game of chance
// mental is a game of skill

export class Roulette extends SmartContract {
  @state(Cipher) c1 = State<Cipher>()
  @state(Field) pk = State<Field>()
  @state(Field) result = State<Field>()

  @method setPubKey (pk: Field) {
    this.pk.set(pk)
    this.c1.set(ElGamalFF.encrypt(Field(1), pk))
  }

  @method join (randomValue: Field) {
    const c1 = this.c1.get()
    this.c1.assertEquals(c1)

    const pk = this.pk.get()
    this.pk.assertEquals(pk)

    const product = c1.mul(ElGamalFF.encrypt(randomValue, pk))
    this.c1.set(product)
  }

  // calculate shuffle
  @method spinner (secretKey: Field) {
    const result = this.c1.get()
    this.c1.assertEquals(result)

    const plainText = ElGamalFF.decrypt(result, secretKey)
    this.result.set(plainText as any)
  }

  @method reset () {
    this.pk.set(Field(0))
    this.result.set(Field(0))
  }
}
