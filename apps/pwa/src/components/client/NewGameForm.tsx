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


  // // Do Setup
  const [state, setState] = useState({
    zkappWorkerClient: null as null | any,
    hasWallet: null as null | boolean,
    hasBeenSetup: false,
    accountExists: false,
    currentResult: null as null | any,
    publicKey: null as null | any,
    zkappPublicKey: null as null | any,
    creatingTransaction: false
  });
  const [displayText, setDisplayText] = useState('');
  const [transactionlink, setTransactionLink] = useState('');

  useEffect(() => {
    async function timeout(seconds: number): Promise<void> {
      return new Promise<void>((resolve) => {
        setTimeout(() => {
          resolve();
        }, seconds * 1000);
      });
    }

    (async () => {
      setIsLoading(true)
      const { PublicKey, Mina, PrivateKey, Field } = await import('o1js')
      const zkappWorkerClientModule = await import("@/app/zkappWorkerClient");
      const ZkappWorkerClient = zkappWorkerClientModule.default;
      const { getMinaWallet } = await import('@/lib/mina')

      // if (!state.hasBeenSetup) {
      setDisplayText('Loading web worker...');
      console.log('Loading web worker...');
      const zkappWorkerClient = new ZkappWorkerClient();
      await timeout(5);

      setDisplayText('Done loading web worker');
      console.log('Done loading web worker');

      await zkappWorkerClient.setActiveInstanceToBerkeley();

      // const mina = await getMinaWallet()
      const mina = (window as any).mina;

      if (mina == null) {
        setState({ ...state, hasWallet: false });
        return;
      }
      const minaPubKey = mina.pub
      let publicKeyBase58: string
      let publicKey
      if (minaPubKey) {
        publicKeyBase58 = (minaPubKey) as string;
        publicKey = PublicKey.fromBase58(publicKeyBase58);
        console.log(`Using key:${publicKey.toBase58()}`);
        setDisplayText(`Using key:${publicKey.toBase58()}`);
      }

      setDisplayText('Checking if fee payer account exists...');
      console.log('Checking if fee payer account exists...');

      const res = await zkappWorkerClient.fetchAccount({
        publicKey: publicKey!
      });
      const accountExists = res.error == null;

      await zkappWorkerClient.loadContract();

      console.log('Compiling zkApp...');
      setDisplayText('Compiling zkApp...');
      await zkappWorkerClient.compileContract();
      console.log('zkApp compiled');
      setDisplayText('zkApp compiled...');

      const zkappPublicKey = PublicKey.fromBase58(ZKAPP_ADDRESS);

      await zkappWorkerClient.initZkappInstance(zkappPublicKey);

      console.log('Getting zkApp state...');
      setDisplayText('Getting zkApp state...');
      await zkappWorkerClient.fetchAccount({ publicKey: zkappPublicKey });
      const currentResult = await zkappWorkerClient.getResult()
      console.log(`Current result in zkApp: ${currentResult.toString()}`);
      setDisplayText('');

      setState({
        ...state,
        zkappWorkerClient,
        hasWallet: true,
        hasBeenSetup: true,
        publicKey: null,
        zkappPublicKey,
        accountExists,
        currentResult
      });
      setIsLoading(false)
    })();
  }, []);

  useEffect(() => {
    (async () => {
      if (state.hasBeenSetup && !state.accountExists) {
        for (; ;) {
          setDisplayText('Checking if fee payer account exists...');
          console.log('Checking if fee payer account exists...');
          const res = await state.zkappWorkerClient!.fetchAccount({
            publicKey: state.publicKey!
          });
          const accountExists = res.error == null;
          if (accountExists) {
            break;
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
        }
        setState({ ...state, accountExists: true });
      }
    })();
  }, [state.hasBeenSetup]);

  // const createTx = async () => {
  //   const zkappWorkerClient = new ZkappWorkerClient();
  //   const mina = (window as any).mina;
  //   const publicKeyBase58: string = (await mina.requestAccounts())[0];
  //   const publicKey = PublicKey.fromBase58(publicKeyBase58);
  //   await zkappWorkerClient.setPubKeyTransaction()
  // }

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

    setIsLoading(false);
    setSheetOpen(false);
  }
  // useEffect(() => {
  //   (async () => {
  //     const { pub, key } = await getMinaWallet()
  //     await sendTx(pub, key)
  //   })();
  // }, []);

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
