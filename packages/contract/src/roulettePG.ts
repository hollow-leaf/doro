import {
  Field,
  ZkProgram,
  SelfProof,
  Provable,
  Bool,
} from "o1js"

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
  },
})
