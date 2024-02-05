"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Container from "@/components/ui/container";
import { PublicCard } from '@/components/DoroCard/public-card'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { useEffect, useState } from 'react'

export default function Page() {
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

    const mockPrivateList = [
        {
            id: "4",
            title: "Private Game 1",
            prize: "100 U",
            type: "private",
            fee: 0,
            seatLimit: 20,
            emptySeat: 10,
            creator: "A"
        },
        {
            id: "5",
            title: "Private Game 2",
            prize: "100 U",
            type: "private",
            fee: 0,
            seatLimit: 20,
            emptySeat: 10,
            creator: "B"
        },
        {
            id: "6",
            title: "Private Game 3",
            prize: "100 U",
            type: "private",
            fee: 0,
            seatLimit: 20,
            emptySeat: 10,
            creator: "C"
        },
    ]
    const [publicList, setPublicList] = useState(mockPublicList)
    const [privateList, setPrivateList] = useState(mockPrivateList)

    return (
        <main>
            <div className='flex flex-col justify-center items-center'>
                <div className='font-roboto text-3xl font-bold mb-4'>
                    Lobby
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
                                    <PublicCard
                                        key={index}
                                        id={game.id}
                                        title={game.title}
                                        prize={game.prize}
                                        type={game.type}
                                        fee={game.fee}
                                        seatLimit={game.seatLimit}
                                        emptySeat={game.emptySeat}
                                        creator={game.creator}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="private">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                {privateList.map((game, index) => (
                                    <PublicCard
                                        key={index}
                                        id={game.id}
                                        title={game.title}
                                        prize={game.prize}
                                        type={game.type}
                                        fee={game.fee}
                                        seatLimit={game.seatLimit}
                                        emptySeat={game.emptySeat}
                                        creator={game.creator}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                </Tabs>
            </div>
        </main>
    );
}

