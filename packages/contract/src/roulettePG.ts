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

      method (pk: Field, earlierProof: SelfProof<Field, Cipher>, randomNumber: Field) {
        earlierProof.verify()
        const output = earlierProof.publicOutput.mul(ElGamalFF.encrypt(randomNumber, pk))
        return output
      },
    },
  },
})

const { verificationKey } = await RoulettePG.compile()
export class RouletteProof extends ZkProgram.Proof(RoulettePG) {}

// only game admin can deploy this contract (will optimize to multi game)
export class RoulettePGContract extends SmartContract {
  @state(Cipher) c1 = State<Cipher>()
  @state(Field) pk = State<Field>()
  @state(Field) result = State<Field>()

  @method setPubKey (pk: Field) {
    this.pk.set(pk)
    this.c1.set(ElGamalFF.encrypt(Field(1), pk))
  }

  @method setResults (proof: RouletteProof, sk: Field) {
    proof.verify()

    const result = ElGamalFF.decrypt(proof.publicOutput as Cipher, sk)
    this.result.set(result)
  }
}
