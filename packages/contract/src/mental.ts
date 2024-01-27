import {
  Field,
  state,
  State,
  method,
  SmartContract,
  MerkleTree,
  isReady,
  MerkleWitness,
} from "o1js"
import { Cipher, ElGamalFF } from "o1js-elgamal"

class GameInfo extends MerkleWitness(8) {
  @state(Field) gameId = State<Field>()
  @state(Field) result = State<Field>()
}

export class Mental extends SmartContract {
  @state(Cipher) c1 = State<Cipher>()
  @state(Field) pk = State<Field>()
  @state(Field) result = State<Field>()
  @state(MerkleTree) gameTree = State<MerkleTree>()

  private initGameTree() {
    if (!isReady(this.gameTree)) {
      this.gameTree.set(new MerkleTree(8))
    }
  }

  @method setPubKey(pk: Field) {
    this.pk.set(pk)
    this.c1.set(ElGamalFF.encrypt(Field(1), pk))
  }

  @method startGame(gameId: Field) {
    this.initGameTree()
    const gameInfo = new GameInfo()
    gameInfo.gameId.set(gameId)
    this.gameTree.get().setLeaf(gameId.toBigInt(), gameInfo.hash())
  }

  @method shuffleValue(gameId: Field, randomValue: Field) {
    this.initGameTree()
    const gameInfo = new GameInfo(this.gameTree.get().getWitness(gameId.toBigInt()))
    gameInfo.result.set(randomValue)
    this.gameTree.get().setLeaf(gameId.toBigInt(), gameInfo.hash())

    const c1 = this.c1.get()
    this.c1.assertEquals(c1)

    const pk = this.pk.get()
    this.pk.assertEquals(pk)

    const product = c1.mul(ElGamalFF.encrypt(randomValue, pk))
    this.c1.set(product)
  }

  @method decrypt(secretKey: Field, gameId: Field) {
    this.initGameTree()
    const gameInfo = new GameInfo(this.gameTree.get().getWitness(gameId.toBigInt()))
    const result = gameInfo.result.get()
    gameInfo.result.assertEquals(result)

    const plainText = ElGamalFF.decrypt(result, secretKey)
    this.result.set(plainText as any)
  }

  @method reset() {
    this.pk.set(Field(0))
    this.result.set(Field(0))
    this.gameTree.set(new MerkleTree(8))
  }
}
