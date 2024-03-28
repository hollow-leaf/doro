"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { useEffect, useState } from 'react'

import { PublicGame } from "@/components/DoroCard/public-game";
import { PrivateGame } from "@/components/DoroCard/private-game";
import { getMinaWallet, minaSetup } from "@/lib/mina";
import { Roulette } from 'contract'
import { Mina } from 'o1js'
type Transaction = Awaited<ReturnType<typeof Mina.transaction>>;
//---------------------------------
let transactionFee = 1;
const ZKAPP_ADDRESS = 'B62qkgLQwEMKHPS92NLpCuw8p6y6KBScGDF1mevb7VhNedmNJCR2K4s';
//---------------------------------

export default function Page() {
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
    const mockPublicList = [
        {
            id: "1",
            title: "Public Game 1",
            prize: "100 U",
            type: "public",
            fee: 1,
            seatLimit: 20,
            emptySeat: 10,
            creator: "A"
        },
        {
            id: "2",
            title: "Public Game 2",
            prize: "100 U",
            type: "public",
            fee: 1,
            seatLimit: 20,
            emptySeat: 10,
            creator: "B"
        },
        {
            id: "3",
            title: "Public Game 3",
            prize: "100 U",
            type: "public",
            fee: 1,
            seatLimit: 20,
            emptySeat: 10,
            creator: "C"
        },
    ]

    const [publicList, setPublicList] = useState(mockPublicList)
    useEffect(() => {
        (async () => {
            if (!state.hasBeenSetup) {
                const initState = await minaSetup(ZKAPP_ADDRESS)
                if (initState) {
                    setState(initState)
                }
            }
        })();
    }, []);

    const joinGame = async () => {
        const { PublicKey, Mina, Field, PrivateKey } = await import('o1js')

        const minaWallet = await getMinaWallet()
        const publicKeyBase58: string = minaWallet?.pub ?? 'B62qjhvkfF1JUoU9tjuUHjxtTtenM3z9ry8hGUnrCDiTrGCfmPYsUDB';
        const publicKey = PublicKey.fromBase58(publicKeyBase58);
        let privatekey: string = 'TEST'

        const randomValue = Field(Math.floor(Math.random() * (10000 - 1) + 1))

        const transaction = await Mina.transaction(publicKey, () => {
            state.zkapp?.join(randomValue)
        })
        await transaction.prove()
        await transaction.sign([PrivateKey.fromBase58(privatekey)]).send()
        state.transaction = transaction as Transaction;

    }
    return (
        <main>
            <div className='flex flex-col justify-center items-center'>
                <div className='font-roboto text-3xl font-bold mb-4'>
                    GAME
                </div>
                <Tabs defaultValue="public" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="public">Public</TabsTrigger>
                        <TabsTrigger value="private">Private</TabsTrigger>
                    </TabsList>
                    <TabsContent value="public">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                {publicList.map((game, index) => (
                                    <PublicGame
                                        key={index}
                                        id={game.id}
                                        title={game.title}
                                        prize={game.prize}
                                        type={game.type}
                                        fee={game.fee}
                                        seatLimit={game.seatLimit}
                                        emptySeat={game.emptySeat}
                                        creator={game.creator}
                                        joinGame={joinGame}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="private">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                <PrivateGame />
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}

