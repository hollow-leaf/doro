"use client";
import { Card } from "@/components/ui/card";
import {
    DollarSign,
    LogOut,
} from "lucide-react";
import { useState } from "react";
import { Spinner } from "@/components/Spinner";
import { delay } from "@/lib/utils";

export default function page() {

    const [isLoading, setIsLoading] = useState(false);
    const [wallet, setWallet] = useState("Mina Wallet Address")
    const [balance, setBalance] = useState(1000)

    return (
        <main>
            <div className="mt-6 flex flex-col items-center">
                <h1 className="mt-3 text-2xl font-bold">
                    {/* {session ? session.user.name : "Loading..."} */}
                    {true ? wallet : "Loading..."}
                </h1>
            </div>

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
        </main>
    );
}
