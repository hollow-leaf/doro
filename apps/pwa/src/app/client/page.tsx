"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import Container from "@/components/ui/container";

export default function Page() {
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
                    <TabsContent value="public">Make changes to your account here.</TabsContent>
                    <TabsContent value="private">Change your password here.</TabsContent>
                </Tabs>
            </div>
        </main>
    );
}

