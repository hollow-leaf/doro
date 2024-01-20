import Client from 'mina-signer'

export const sign = (message: string, privateKey: string) => {
  const client = new Client({ network: 'testnet' })
  let sign = client.signMessage(message, privateKey)
  return sign
}

function main () {
  console.log(sign('hi', 'EKFGnwBs3Bo9rftniAELWchhhduhyD1AuJtqanFTJba1kegP5QRx'))
} 

main()