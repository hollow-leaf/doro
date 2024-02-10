"use client";
import { Card } from "@/components/ui/card";
import {
    DollarSign,
    LogOut,
} from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { delay, shortenText } from "@/lib/utils";
import { useEffect } from 'react';
import { Button } from "@/components/ui/button"
import { generateKey, getMinaWallet } from "@/lib/mina";

export default function page() {

    const [isLoading, setIsLoading] = useState(false);
    const [isSigned, setSinged] = useState(false);
    const [wallet, setWallet] = useState("Mina Wallet")
    const [balance, setBalance] = useState(1000)

    const createAccount = () => {
        const { key, pub } = generateKey()
        setWallet(shortenText(pub, 10))
        setSinged(true)
    }

    useEffect(() => {
        const getWallet = async () => {
            const minaKey = await getMinaWallet()
            console.log('Hi')

            if (!!minaKey) {
                console.log('sdfdffds')
                setWallet(shortenText(minaKey.pub, 10))
                setSinged(true)
            }
        }
        getWallet()
    }, [])

    return (
        <main>
            <div className="mt-6 flex flex-col items-center">
                <h1 className="mt-3 text-2xl font-bold">
                    {/* {session ? session.user.name : "Loading..."} */}
                    {isSigned ? wallet : "WELCOME DORO"}
                </h1>
            </div>
            {
                isSigned ?
                    (
                        <>
                            <Card className="mt-8 flex w-full flex-col border px-5  py-1 shadow">
                                <div className="flex items-center justify-between py-3">
                                    <div className="flex items-center ">
                                        <div className="mr-3 w-fit rounded-lg p-1.5 ">
                                            <DollarSign size={22} color="white" strokeWidth={2} />
                                        </div>
                                        <span>Balance : {balance}</span>
                                    </div>
                                </div>
                            </Card>
                            <Card className="mt-6 flex w-full flex-col   border  px-5  shadow">
                                <button
                                    disabled={isLoading}
                                    onClick={() => {
                                        setIsLoading(true);

                                        // TODO: Disconnect (Mock Loading)
                                        delay(500).finally(() => {
                                            setIsLoading(false);
                                        });
                                    }}
                                >
                                    <div className="flex items-center py-3">
                                        {!isLoading ? (
                                            <div className="flex items-center">
                                                <div className="mr-3 w-fit rounded-lg p-1.5 ">
                                                    <LogOut size={22} color="white" />
                                                </div>
                                                <span>Disconnect</span>
                                            </div>
                                        ) : (
                                            <div className="flex w-full justify-center">
                                                <Spinner />
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </Card>
                        </>)
                    :
                    (
                        <div className="flex flex-col items-center justify-center mt-12">
                            <Button
                                onClick={createAccount}>
                                Create Account
                            </Button>
                        </div>
                    )
            }

        </main>
    );
}
