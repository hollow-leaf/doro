import {
  Field,
  state,
  State,
  ZkProgram,
  SelfProof,
  Provable,
  Bool,
  SmartContract,
  method,
} from "o1js"
import { Cipher, ElGamalFF } from "o1js-elgamal"

export const RoulettePG = ZkProgram({
  name: "roulette-program",
  publicInput: Field,
  publicOutput: Field,

  methods: {
    init: {
      privateInputs: [],
      method (publicInput: Field) {
        publicInput.assertEquals(0)
        return publicInput
      },
    },
    processMessage: {
      privateInputs: [SelfProof, Field],

      method (messageNumber: Field, earlierProof: SelfProof<Field, Field>, message: Field) {
        // messageNumber.set(msgNumber)
        const isValid = Bool(true)
        return Provable.if(
          isValid,
          Field,
          messageNumber,
          earlierProof.publicOutput,
        )
      },
    },
    shuffle: {
      privateInputs: [SelfProof, Field],

      method (messageNumber: Field, earlierProof: SelfProof<Field, Field>, message: Field) {
        // messageNumber.set(msgNumber)
        const isValid = Bool(true)
        return Provable.if(
          isValid,
          Field,
          messageNumber,
          earlierProof.publicOutput,
        )
      },
    },
  },
})

const { verificationKey } = await RoulettePG.compile()
class RouletteProof extends ZkProgram.Proof(RoulettePG) {}
export class RoulettePGContract extends SmartContract {
  @state(Cipher) c1 = State<Cipher>()
  @state(Field) pk = State<Field>()
  @state(Field) result = State<Field>()

  @method setPubKey (pk: Field) {
    this.pk.set(pk)
    this.c1.set(ElGamalFF.encrypt(Field(1), pk))
  }

  @method setResults (proof: RouletteProof) {
    proof.verify()

    const result = proof.publicOutput
    this.result.set(result)
  }
}
