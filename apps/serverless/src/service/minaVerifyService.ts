import Client from 'mina-signer'

export const sign = (message: string, privateKey: string) => {
  const client = new Client({ network: 'testnet' })
  let sign = client.signMessage(message, privateKey)
  return sign
}

export const verify = (data: any, signature: any, publicKey: string) => {
  const client = new Client({ network: 'testnet' })
  let verify = client.verifyMessage({data, signature, publicKey})
  return verify
}
