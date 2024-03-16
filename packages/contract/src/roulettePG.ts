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

// free and off-chain doro program
export const RoulettePG = ZkProgram({
  name: "roulette-program",
  publicInput: Field,
  publicOutput: Cipher,

  methods: {
    init: {
      privateInputs: [],
      method (pk: Field) {
        const publicOutput = ElGamalFF.encrypt(Field(1), pk)
        return publicOutput
      },
    },

    shuffle: {
      privateInputs: [SelfProof, Field],

      method (messageNumber: Field, earlierProof: SelfProof<Field, Cipher>, randomNumber: Field, pk: Field) {
        // messageNumber.set(msgNumber)
        earlierProof.verify()
        const output = earlierProof.publicOutput.mul(ElGamalFF.encrypt(randomNumber, pk))
        const isValid = Bool(true)
        return Provable.if(
          isValid,
          Field,
          randomNumber,
          earlierProof.publicOutput,
        )
      },
    },
  },
})

const { verificationKey } = await RoulettePG.compile()
class RouletteProof extends ZkProgram.Proof(RoulettePG) {}

// only game admin can deploy this contract (will optimize to multi game)
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
