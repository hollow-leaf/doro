import './reactCOIServiceWorker';

export const generateKey = async () => {
    const { PrivateKey } = await import('o1js');
    const key = PrivateKey.random()
    localStorage.setItem("MinaKey", key.toBase58())
    return {key: key.toBase58(), pub: key.toPublicKey().toBase58()}
}

export const getMinaWallet = async () => {
    const { PrivateKey } = await import('o1js');
    const minaKey = localStorage.getItem("MinaKey")
    if (minaKey) {
        return {
            pub: PrivateKey.fromBase58(minaKey).toPublicKey().toBase58(),
            key: minaKey
        }
    }
    return null
}