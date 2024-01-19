import { PrivateKey, Field, Signature } from "o1js";

export const sign = (message: Field[], privateKey: PrivateKey) => {
  const sig = Signature.create(privateKey, message);
  return sig
}

function main () {
  const pv = PrivateKey.random()
  const pub = pv.toPublicKey()

  const sig = sign([Field(1), Field(2)], pv)
  console.log('sig: ', sig)
} 

main()