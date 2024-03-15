/* global describe, beforeAll, beforeEach, it, expect */
import {
  Field,
  PrivateKey,
  Mina,
  AccountUpdate,
  PublicKey,
} from "o1js"
import { ElGamalFF } from "o1js-elgamal"
import { Roulette } from "./roulette"

const proofsEnabled = false

describe("Roullette Test", () => {
  let deployerAccount: PublicKey,
    deployerKey: PrivateKey,
    senderAccount: PublicKey,
    senderKey: PrivateKey,
    zkAppAddress: PublicKey,
    zkAppPrivateKey: PrivateKey,
    zkApp: Roulette

  beforeAll(async () => {
    if (proofsEnabled) await Roulette.compile()
  })

  beforeEach(() => {
    const local = Mina.LocalBlockchain({ proofsEnabled })
    Mina.setActiveInstance(local);
    ({ privateKey: deployerKey, publicKey: deployerAccount } =
      local.testAccounts[0]);
    ({ privateKey: senderKey, publicKey: senderAccount } =
      local.testAccounts[1])
    zkAppPrivateKey = PrivateKey.random()
    zkAppAddress = zkAppPrivateKey.toPublicKey()
    zkApp = new Roulette(zkAppAddress)
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

  describe("a Roulette Game Flow", () => {
    it("should start a game", async () => {
      await localDeploy()
      // step 1. set a elagamal public key (game starter)
      const { pk, sk } = ElGamalFF.generateKeys()

      let txn = await Mina.transaction(deployerAccount, () => {
        zkApp.setPubKey(pk)
      })
      await txn.prove()
      await txn.sign([deployerKey]).send()

      // step 2. user join a game
      const randomValue = Field(Math.floor(Math.random() * (10000 - 1) + 1))

      txn = await Mina.transaction(senderAccount, () => {
        zkApp.join(randomValue)
      })
      await txn.prove()
      await txn.sign([senderKey]).send()

      // step 3. spinner
      txn = await Mina.transaction(deployerAccount, () => {
        zkApp.spinner(sk)
      })
      await txn.prove()
      await txn.sign([deployerKey]).send()

      // step 4. get result
      expect(zkApp.result.get()).toEqual(randomValue)
    })
  })
})
