/* global describe, beforeAll, beforeEach, it */
import { Cipher, ElGamalFF } from "o1js-elgamal"
import { RoulettePG, RoulettePGContract } from "./roulettePG"
import { Mina, PrivateKey, PublicKey, AccountUpdate, Field } from "o1js"
const proofsEnabled = false

describe("RoulettePG ZKProgram", () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: RoulettePGContract

  beforeAll(async () => {
    if (proofsEnabled) await RoulettePGContract.compile()
  })

  beforeEach(() => {
    const Local = Mina.LocalBlockchain({ proofsEnabled })
    Mina.setActiveInstance(Local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      Local.testAccounts[0]);
    ({ privateKey: senderKey, publicKey: senderAccount } =
      Local.testAccounts[1])
    zkAppPrivateKey = PrivateKey.random()
    zkAppAddress = zkAppPrivateKey.toPublicKey()
    zkApp = new RoulettePGContract(zkAppAddress)
  })

  async function localDeploy () {
    const txn = await Mina.transaction(deployerAccount, () => {
      AccountUpdate.fundNewAccount(deployerAccount)
      zkApp.deploy()
    })
    await txn.prove()
    // this tx needs .sign(), because `deploy()` adds an account update that requires signature authorization
    await txn.sign([deployerKey, zkAppPrivateKey]).send()
  }

  function randomInt (min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  describe("RoulettePGContract", () => {
    it("should deploy", async () => {
      await localDeploy()
      // first proof
      const proof = await RoulettePG.init(Field(1))
    })

    it("Game Play", async () => {
      await localDeploy()

      // step 1. set a elagamal public key (game starter)
      const { pk, sk } = ElGamalFF.generateKeys()

      const txn = await Mina.transaction(deployerAccount, () => {
        zkApp.setPubKey(pk)
      })
      await txn.prove()
      await txn.sign([deployerKey]).send()

      // step 2. everyone join a game
      let proof = await RoulettePG.init(Field(1))
      for (let i = 0; i < 3; i += 1) {
        const randomValue = Field(randomInt(1, 10000))
        proof = await RoulettePG.shuffle(Field(i), proof, randomValue)
      }

      // step 3. spinner
      const txR = await Mina.transaction(deployerAccount, () => {
        zkApp.setResults(proof, sk)
      })
      await txR.prove()
      await txR.sign([deployerKey]).send()
    })
  })
})
