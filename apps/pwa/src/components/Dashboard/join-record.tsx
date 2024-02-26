import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogClose
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/Spinner"
import { delay } from "@/lib/utils"
import {
    PartyPopperIcon,
    Frown
} from "lucide-react"

type JoinRecordProps = React.ComponentProps<typeof Card> & {
    id: string,
    prize: string,
    overDue: boolean,
    creator: string,
    revealed: boolean
}

export function JoinRecord({ className, ...props }: JoinRecordProps) {
    const [isLoading, setIsLoading] = useState(false)
    const [open, setOpen] = useState(false)
    const [isFinished, setFinished] = useState(false)
    const [rewardStatus, setReward] = useState(false)

    useEffect(() => {
        if (!open) {
            setFinished(false)
        }
    }, [open])

    const reveal = () => {
        const randomBoolean = Math.random() < 0.5;
        setReward(randomBoolean)
    }

    return (
        !props.overDue ?
            (<Card
                className={cn(
                    "w-full bg-muted bg-opacity-90 border",
                    className
                )}
                {...props}
            >
                <CardHeader className="p-6 py-3">
                    <div className="flex text-xl font-roboto-bold items-center justify-end">
                    </div>
                    <CardTitle>
                        <div className="border-b">{props.title}</div>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col">
                        <div>{props.prize}</div>
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end">
                    {props.creator}
                </CardFooter>
            </Card>)
            : (
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Card
                            className={cn(
                                "w-full bg-muted bg-opacity-90 border",
                                className
                            )}
                            {...props}
                        >
                            <CardHeader className="p-6 py-3">
                                <div className="flex text-xl font-roboto-bold items-center justify-end">
                                </div>
                                <CardTitle>
                                    <div className="border-b">{props.title}</div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col">
                                    <div>{props.prize}</div>
                                </div>
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                {props.creator}
                            </CardFooter>
                        </Card>
                    </DialogTrigger>
                    <DialogContent className="max-w-[250px]">
                        {open
                            ? (<>
                                {!isFinished ? (
                                    <div>
                                        <DialogHeader>
                                            <DialogTitle>Open Ticket?</DialogTitle>
                                        </DialogHeader>
                                        <div className="grid gap-4 py-4">
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="GAME" className="text-right">
                                                    GAME
                                                </Label>
                                                <Label className="col-span-3">
                                                    {props.title}
                                                </Label>
                                            </div>
                                            <div className="grid grid-cols-4 items-center gap-4">
                                                <Label htmlFor="Prize" className="text-right">
                                                    Prize
                                                </Label>
                                                <Label className="col-span-3">
                                                    {props.prize}
                                                </Label>
                                            </div>
                                        </div>
                                        <DialogFooter>
                                            {
                                                !isLoading ? (
                                                    <Button
                                                        onClick={() => {
                                                            console.log(`DORO ${props.id}`)
                                                            setIsLoading(true)

                                                            // TODO: Reveal (Mock Loading)
                                                            delay(500).finally(() => {
                                                                setIsLoading(false)
                                                                setFinished(true)
                                                                reveal()
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
                                                {rewardStatus ? "CONGRAT" : "SORRY"}
                                            </DialogTitle>
                                            <div className="grid gap-4 py-4 items-center justify-center">
                                                <div className="flex flex-row space-x-1">
                                                    {
                                                        rewardStatus ?
                                                            (
                                                                <>
                                                                    <div>Got the prize</div>
                                                                    <PartyPopperIcon />
                                                                </>
                                                            )
                                                            : (
                                                                <>
                                                                    <div>Did not get the prize</div>
                                                                    <Frown />
                                                                </>
                                                            )
                                                    }
                                                </div>
                                            </div>
                                        </DialogHeader>
                                        <DialogFooter>
                                            <DialogClose asChild>
                                                <Button
                                                    onClick={() => {
                                                        console.log(`You got the Game ${props.id} prizes.`)
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
            )
    )
}
