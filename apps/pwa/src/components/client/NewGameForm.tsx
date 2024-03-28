import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Spinner } from "../Spinner";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import '@/lib/reactCOIServiceWorker';
import { getMinaWallet, minaSetup, timeout } from "@/lib/mina";
import { Roulette } from 'contract'
import { Mina } from 'o1js'
type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;

//---------------------------------
let transactionFee = 1;
const ZKAPP_ADDRESS = 'B62qkgLQwEMKHPS92NLpCuw8p6y6KBScGDF1mevb7VhNedmNJCR2K4s';
//---------------------------------

const formSchema = z.object({
  typeId: z.string().min(1, { message: "Please select type of game" }),
  room: z.string().min(1, { message: "Please set room name" }),
});

export default function NewGameForm({
  className,
  setSheetOpen,
}: {
  className?: string;
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [types, setTypes] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [state, setState] = useState({
    zkappWorkerClient: null as null | any,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentResult: null as null | any,
    publicKey: null as null | any,
    zkappPublicKey: null as null | any,
    creatingTransaction: false,
    Roulette: null as null | any,
    zkapp: null as null | Roulette,
    transaction: null as null | Transaction
  });

  const [displayText, setDisplayText] = useState('');
  const [transactionlink, setTransactionLink] = useState('');

  useEffect(() => {
    (async () => {
      setIsLoading(true)
      if (!state.hasBeenSetup) {
        const initState = await minaSetup(ZKAPP_ADDRESS)
        if (initState) {
          setState(initState)
        }
      }
      setIsLoading(false)
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (state.hasBeenSetup && !state.accountExists) {
        for (; ;) {
          console.log('Checking if fee payer account exists...');
          const minaWallet = await getMinaWallet()
          const accountExists = minaWallet ? true : false;
          if (accountExists) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        setState({ ...state, accountExists: true });
      }
    })();
  }, [state.hasBeenSetup]);

  const setupNewGame = async () => {
    const { PublicKey, Mina, Field, PrivateKey } = await import('o1js')
    const { ElGamalFF } = await import("o1js-elgamal")

    const minaWallet = await getMinaWallet()
    const publicKeyBase58: string = minaWallet?.pub ?? 'B62qjhvkfF1JUoU9tjuUHjxtTtenM3z9ry8hGUnrCDiTrGCfmPYsUDB';
    const publicKey = PublicKey.fromBase58(publicKeyBase58);
    let privatekey: string = 'TEST'
    const transaction = await Mina.transaction(publicKey, () => {
      const { pk, sk } = ElGamalFF.generateKeys()
      state.zkapp?.setPubKey(pk);
    });

    state.transaction = transaction as Transaction;
    await state.transaction?.prove()
    await state.transaction?.sign([PrivateKey.fromBase58(privatekey)]).send()

  }

  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeId: "",
      room: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    //TODO: Add Game via mina contract
    await setupNewGame()
    setIsLoading(false);
    setSheetOpen(false);
  }

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 py-4"
        >
          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-red-500">* </span>
                  Game Type
                </FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-40">
                    <ScrollArea className="h-full w-full" type="always">
                      <SelectItem key={0} value={String(0)}>
                        Public
                      </SelectItem>
                      <SelectItem key={1} value={String(1)}>
                        Private
                      </SelectItem>
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-red-500">* </span>Room Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mx-auto mb-6 mt-4 h-12 w-[90%]"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Create"}
          </Button>
        </form>
      </Form>
    </>
  );
}


async function workerSetup() {
  const { PublicKey, Mina, PrivateKey, Field } = await import('o1js')
  const zkappWorkerClientModule = await import("@/app/zkappWorkerClient");
  const ZkappWorkerClient = zkappWorkerClientModule.default;
  const { getMinaWallet } = await import('@/lib/mina')

  // // Do Setup
  const initialState = {
    zkappWorkerClient: null as null | any,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentResult: null as null | any,
    publicKey: null as null | any,
    zkappPublicKey: null as null | any,
    creatingTransaction: false
  };

  // if (!state.hasBeenSetup) {
  console.log('Loading web worker...');
  const zkappWorkerClient = new ZkappWorkerClient();
  await timeout(5);

  console.log('Done loading web worker');

  await zkappWorkerClient.setActiveInstanceToBerkeley();

  // const mina = await getMinaWallet()
  const mina = (window as any).mina;

  if (mina == null) {
    initialState.hasWallet = false
    return;
  }
  const minaPubKey = mina.pub
  let publicKeyBase58: string
  let publicKey
  if (minaPubKey) {
    publicKeyBase58 = (minaPubKey) as string;
    publicKey = PublicKey.fromBase58(publicKeyBase58);
    console.log(`Using key:${publicKey.toBase58()}`);
  }

  console.log('Checking if fee payer account exists...');

  const res = await zkappWorkerClient.fetchAccount({
    publicKey: publicKey!
  });
  const accountExists = res.error == null;

  await zkappWorkerClient.loadContract();

  console.log('Compiling zkApp...');
  await zkappWorkerClient.compileContract();
  console.log('zkApp compiled');

  const zkappPublicKey = PublicKey.fromBase58(ZKAPP_ADDRESS);

  await zkappWorkerClient.initZkappInstance(zkappPublicKey);

  console.log('Getting zkApp state...');
  await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
  const currentResult = await zkappWorkerClient.getResult()
  console.log(`Current result in zkApp: ${currentResult.toString()}`);

  initialState.zkappWorkerClient = zkappWorkerClient
  initialState.hasWallet = true
  initialState.hasBeenSetup = true
  initialState.publicKey = null
  initialState.zkappPublicKey = zkappPublicKey
  initialState.accountExists = accountExists
  initialState.currentResult = currentResult
  initialState.creatingTransaction = false

  return initialState
}
