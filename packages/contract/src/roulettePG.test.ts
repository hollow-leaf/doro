import { RoulettePG, RoulettePGContract } from "./roulettePG"
import { Mina, PrivateKey, PublicKey, AccountUpdate } from "o1js"
const proofsEnabled = false

describe("Roulette ZKProgram", () => {
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
})
