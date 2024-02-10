import Client from 'mina-signer';
const client = new Client({ network: 'mainnet' });

export const generateKey = () => {
    const keypair = client.genKeys();
    localStorage.setItem("MinaKey", JSON.stringify(keypair))
    return {key: keypair.privateKey, pub: keypair.publicKey}
}

export const getMinaWallet = async () => {
    const minaKey = localStorage.getItem("MinaKey")
    if (minaKey) {
        return {
            pub: JSON.parse(minaKey).publicKey,
            key: JSON.parse(minaKey).privateKey
        }
    }
    return null
}