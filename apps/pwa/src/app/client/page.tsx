"use client";
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
    Card,
    CardContent,
} from "@/components/ui/card"
import { useEffect, useState } from 'react'
import { JoinRecord } from "@/components/Dashboard/join-record";

type Record = {
    id: string;
    title: string;
    prize: string;
    dueDay: string;
    creator: string;
    revealed: boolean
};

type ClassifiedRecords = {
    expired: Record[];
    active: Record[];
};

const mockRecordList = [
    {
        id: "1",
        title: "Game 1",
        prize: "100 U",
        dueDay: "2024/02/26",
        creator: "A",
        revealed: false
    },
    {
        id: "2",
        title: "Game 2",
        prize: "100 U",
        dueDay: "2024/02/27",
        creator: "B",
        revealed: false
    },
    {
        id: "3",
        title: "Game 3",
        prize: "100 U",
        dueDay: "2024/02/28",
        creator: "C",
        revealed: false
    },
    {
        id: "4",
        title: "Game 4",
        prize: "100 U",
        dueDay: "2024/02/01",
        creator: "D",
        revealed: false
    },
    {
        id: "5",
        title: "Game 5",
        prize: "100 U",
        dueDay: "2024/02/02",
        creator: "E",
        revealed: false
    },
]
export default function page() {
    const [openingList, setOpeningList] = useState<Record[]>([])
    const [historyList, setHistoryList] = useState<Record[]>([])

    const classifyRecords = (records: Record[], currentDate: Date): ClassifiedRecords => {
        const expired: Record[] = [];
        const active: Record[] = [];

        records.forEach((record) => {
            const dueDate = new Date(record.dueDay);
            if (dueDate < currentDate) {
                expired.push(record);
            } else {
                active.push(record);
            }
        });

        return { expired, active };
    };

    useEffect(() => {
        const currentDate = new Date();
        const { expired, active } = classifyRecords(mockRecordList, currentDate);
        setOpeningList(active)
        setHistoryList(expired)
    }, [mockRecordList])

    return (
        <main>
            <div className='flex flex-col justify-center items-center'>
                <div className='font-roboto text-3xl font-bold mb-4'>
                    DASHBOARD
                </div>
                <Tabs defaultValue="opening" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="opening">OPENING</TabsTrigger>
                        <TabsTrigger value="history">HISTORY</TabsTrigger>
                    </TabsList>
                    <TabsContent value="opening">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                {openingList.map((record, index) => (
                                    <JoinRecord
                                        key={index}
                                        id={record.id}
                                        overDue={false}
                                        title={record.title}
                                        prize={record.prize}
                                        creator={record.creator}
                                        revealed={false}
                                    />
                                ))}
                            </CardContent>
                        </Card>
                    </TabsContent>
                    <TabsContent value="history">
                        <Card>
                            <CardContent className="p-6 space-y-4">
                                {historyList.map((record, index) => (
                                    <JoinRecord
                                        key={index}
                                        id={record.id}
                                        overDue={true}
                                        title={record.title}
                                        prize={record.prize}
                                        creator={record.creator}
                                        revealed={record.revealed}
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
