import { Field, Mina, PublicKey, fetchAccount } from 'o1js';

type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

// ---------------------------------------------------------------------------------------

import type { Roulette } from 'contract';

const state = {
  Roulette: null as null | typeof Roulette,
  zkapp: null as null | Roulette,
  transaction: null as null | Transaction
};

// ---------------------------------------------------------------------------------------

const functions = {
  setActiveInstanceToBerkeley: async (args: {}) => {
    const Berkeley = Mina.Network(
      'https://api.minascan.io/node/berkeley/v1/graphql'
    );
    console.log('Berkeley Instance Created');
    Mina.setActiveInstance(Berkeley);
  },
  loadContract: async (args: {}) => {
    const { Roulette } = await import('contract');
    state.Roulette = Roulette;
  },
  compileContract: async (args: {}) => {
    await state.Roulette!.compile();
  },
  fetchAccount: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    return await fetchAccount({ publicKey });
  },
  initZkappInstance: async (args: { publicKey58: string }) => {
    const publicKey = PublicKey.fromBase58(args.publicKey58);
    state.zkapp = new state.Roulette!(publicKey);
  },
  setPubKeyTransaction: async (args: {pk: Field}) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.setPubKey(args.pk);
    });
    state.transaction = transaction;
  },
  joinGameTransaction: async (args: {randomValue: Field}) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.join(args.randomValue);
    });
    state.transaction = transaction;
  },
  spinnerTransaction: async (args: {secretKey: Field}) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.spinner(args.secretKey);
    });
    state.transaction = transaction;
  },
  resetTransaction: async (args: {}) => {
    const transaction = await Mina.transaction(() => {
      state.zkapp!.reset();
    });
    state.transaction = transaction;
  },
  proveTransaction: async (args: {}) => {
    await state.transaction!.prove();
  },
  getTransactionJSON: async (args: {}) => {
    return state.transaction!.toJSON();
  },
  getResult: async (args: {}) => {
    const currentResult = await state.zkapp!.result.get();
    return JSON.stringify(currentResult.toJSON());
  }

};

// ---------------------------------------------------------------------------------------

export type WorkerFunctions = keyof typeof functions;

export type ZkappWorkerRequest = {
  id: number;
  fn: WorkerFunctions;
  args: any;
};

export type ZkappWorkerReponse = {
  id: number;
  data: any;
};

if (typeof window !== 'undefined') {
  addEventListener(
    'message',
    async (event: MessageEvent<ZkappWorkerRequest>) => {
      const returnData = await functions[event.data.fn](event.data.args);

      const message: ZkappWorkerReponse = {
        id: event.data.id,
        data: returnData
      };
      postMessage(message);
    }
  );
}

console.log('Web Worker Successfully Initialized.');
