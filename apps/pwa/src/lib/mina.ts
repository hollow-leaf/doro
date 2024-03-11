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

export async function timeout(seconds: number): Promise<void> {
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        resolve();
      }, seconds * 1000);
    });
  }

export async function minaSetup(ZKAPP_ADDRESS : string) {
    const { PublicKey, Mina, PrivateKey, Field, fetchAccount } = await import('o1js')
    const { getMinaWallet } = await import('@/lib/mina')
    type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;
    const { Roulette } = await import('contract');
  
  
    // // Do Setup
    let initialState = {
      zkappWorkerClient: null as null | any,
      hasWallet: null as null | boolean,
      hasBeenSetup: false,
      accountExists: false,
      currentResult: null as null | any,
      publicKey: null as null | any,
      zkappPublicKey: null as null | any,
      creatingTransaction: false,
      Roulette: null as null | typeof Roulette,
      zkapp: null as null | any,
      transaction: null as null | Transaction
    };
  
    // if (!state.hasBeenSetup) {
    console.log('Loading web worker...');
    await timeout(5);
  
    console.log('Done loading web worker');
  
    // Setup InstanceToBerkeley
    const Berkeley = Mina.Network(
      'https://api.minascan.io/node/berkeley/v1/graphql'
    );
    console.log('Berkeley Instance Created');
    Mina.setActiveInstance(Berkeley);
    await timeout(5);
  
  
    // Get Wallet
    const mina = await getMinaWallet()
    if (mina == null) {
      initialState.hasWallet = false
      return;
    }
  
    // TODO: Mina key is empty wallet by generateKey.
    // const minaPubKey = mina.pub
    const minaPubKey = 'B62qjhvkfF1JUoU9tjuUHjxtTtenM3z9ry8hGUnrCDiTrGCfmPYsUDB'
    let publicKeyBase58: string
    let publicKey
    if (minaPubKey) {
      publicKeyBase58 = (minaPubKey) as string;
      publicKey = PublicKey.fromBase58(publicKeyBase58);
      console.log(`Using key:${publicKey.toBase58()}`);
    }
    console.log('Checking if fee payer account exists...');
    // Skip fetch account
    // let res
    // if (publicKey) {
    //   res = await fetchAccount({ publicKey });
    // }
    // console.log(res)
    // const accountExists = res?.error == null;
    const accountExists = true;
  
    // Load Contract
    initialState.Roulette = Roulette
  
    // Compile Contract 
    console.log('Compiling zkApp...');
    await initialState.Roulette!.compile()
    console.log('zkApp compiled');
  
    // Initial ZK App Instance
    const zkappPublicKey = PublicKey.fromBase58(ZKAPP_ADDRESS);
    initialState.zkapp = new initialState.Roulette!(zkappPublicKey);
  
    // Get ZK App state
    // console.log('Getting zkApp state...');
    // const currentResultRaw = await initialState.zkapp!.result.get()
    // const currentResult = JSON.stringify(currentResultRaw.toJson())
    // console.log(`Current result in zkApp: ${currentResult.toString()}`);
  
    initialState.hasWallet = true
    initialState.hasBeenSetup = true
    initialState.publicKey = null
    initialState.zkappPublicKey = zkappPublicKey
    initialState.accountExists = accountExists
    initialState.currentResult = null
    initialState.creatingTransaction = false
  
    return initialState
  }