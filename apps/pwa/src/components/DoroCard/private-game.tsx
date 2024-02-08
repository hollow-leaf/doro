import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogClose
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/Spinner"
import { delay } from "@/lib/utils"
import {
    PartyPopperIcon,
    Frown
} from "lucide-react"
import { Input } from "@/components/ui/input"

interface PrivateGame {
    id: string;
    title: string;
    prize: string;
    type: string;
    fee: number;
    seatLimit: number;
    emptySeat: number;
    creator: string;
    inviteCode: string;
}

export function PrivateGame({ className, ...props }: any) {

    const mockPrivateList = [
        {
            id: "4",
            title: "Private Game 1",
            prize: "100 U",
            type: "private",
            fee: 0,
            seatLimit: 20,
            emptySeat: 10,
            creator: "A",
            inviteCode: "0"
        },
        {
            id: "5",
            title: "Private Game 2",
            prize: "100 U",
            type: "private",
            fee: 0,
            seatLimit: 20,
            emptySeat: 10,
            creator: "B",
            inviteCode: "1"
        },
        {
            id: "6",
            title: "Private Game 3",
            prize: "100 U",
            type: "private",
            fee: 0,
            seatLimit: 20,
            emptySeat: 10,
            creator: "C",
            inviteCode: "2"
        },
    ]
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [errorOpen, setErrorOpen] = useState(false)
    const [gameInfo, setGameInfo] = useState<PrivateGame>()
    const [isFinished, setFinished] = useState(false)
    const [gameId, setGameId] = useState("")
    const [inviteCode, setInviteCode] = useState("")
    const [privateList, setPrivateList] = useState(mockPrivateList)

    const getPrivateGame = () => {
        const game = privateList.find(game => game.id === gameId && game.inviteCode === inviteCode)
        if (game) {
            setGameInfo(game)
            setOpen(true)
        } else {
            setErrorOpen(true)
            console.log("Game is not exist or invite code is invalid.")
        }
    }

    useEffect(() => {
        if (!open) {
            setFinished(false)
        }
    }, [open])

    return (
        <>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="game-id">Game ID</Label>
                <Input type="text" id="game-id" onChange={(e) => setGameId(e.target.value)} />
            </div>
            <div className="grid w-full max-w-sm items-center gap-1.5">
                <Label htmlFor="invite-code">Invite Code</Label>
                <Input type="text" id="invite-code" onChange={(e) => setInviteCode(e.target.value)} />
            </div>
            {!isLoading ? (
                <div className="grid w-full max-w-sm items-center gap-1.5">
                    <Button
                        onClick={() => {
                            setIsLoading(true)
                            // TODO: Search (Mock Loading)
                            delay(500).finally(() => {
                                setIsLoading(false)
                                getPrivateGame()
                            })
                        }
                        }
                    >Join Game</Button>
                </div>
            ) : (
                <div className="flex w-full justify-center">
                    <Spinner />
                </div>
            )}
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent className="max-w-[250px]">
                    {open
                        ? (<>
                            {!isFinished ? (
                                <div>
                                    <DialogHeader>
                                        <DialogTitle>Join Game ?</DialogTitle>
                                    </DialogHeader>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="GAME" className="text-right">
                                                GAME
                                            </Label>
                                            <Label className="col-span-3">
                                                {gameInfo?.title}
                                            </Label>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="Prize" className="text-right">
                                                Prize
                                            </Label>
                                            <Label className="col-span-3">
                                                {gameInfo?.prize}
                                            </Label>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="fee" className="text-right">
                                                fee
                                            </Label>
                                            <Label className="col-span-3">
                                                {gameInfo?.fee}
                                            </Label>
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        {
                                            !isLoading ? (
                                                <Button
                                                    onClick={() => {
                                                        console.log(`DORO ${gameInfo?.id}`)
                                                        setIsLoading(true)

                                                        // TODO: DORO (Mock Loading)
                                                        delay(500).finally(() => {
                                                            setIsLoading(false)
                                                            setFinished(true)
                                                        })
                                                    }}>DORO
                                                </Button>
                                            ) : (
                                                <div className="flex w-full justify-center">
                                                    <Spinner />
                                                </div>
                                            )
                                        }
                                    </DialogFooter>
                                </div>
                            ) : (
                                <div>
                                    <DialogHeader>
                                        <DialogTitle>
                                            GOOD LUCK
                                        </DialogTitle>
                                        <div className="grid gap-4 py-4 items-center justify-center">
                                            <PartyPopperIcon />
                                        </div>
                                    </DialogHeader>
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button
                                                onClick={() => {
                                                    console.log(`GoodLuck ${gameInfo?.id}`)
                                                }}>OK
                                            </Button>
                                        </DialogClose>
                                    </DialogFooter>
                                </div>
                            )}
                        </>)
                        : (<>
                            { }
                        </>)}
                </DialogContent >
            </Dialog >
            <Dialog open={errorOpen} onOpenChange={setErrorOpen}>
                <DialogContent className="max-w-[250px]">
                    <DialogHeader>
                        <DialogTitle>
                            GAME NOT FOUND
                        </DialogTitle>
                        <div className="grid gap-4 py-4 items-center justify-center">
                            <Frown />
                        </div>
                    </DialogHeader>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button
                                onClick={() => {
                                    console.log(`CANCEL ${gameInfo?.id}`)
                                }}>OK
                            </Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent >
            </Dialog >

        </>


    )
}
