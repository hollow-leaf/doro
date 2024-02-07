import { useEffect, useState } from "react";
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
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/Spinner";
import { delay } from "@/lib/utils";
import {
    PartyPopperIcon
} from "lucide-react";

type GameCardProps = React.ComponentProps<typeof Card> & {
    id: string,
    prize: string,
    type: string,
    fee: number,
    seatLimit: number,
    emptySeat: number,
    creator: string
};

enum status {
    default = 0,
    success = 1,
    error = 2
}

export function GameCard({ className, ...props }: GameCardProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [isFinished, setFinished] = useState(false)

    useEffect(() => {
        if (!open) {
            setFinished(false)
        }
    }, [open])

    return (
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
                            <div>{props.seatLimit - props.emptySeat} / {props.seatLimit}</div>
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
                                    <DialogTitle>Join Game ?</DialogTitle>
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
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="fee" className="text-right">
                                            fee
                                        </Label>
                                        <Label className="col-span-3">
                                            {props.fee}
                                        </Label>
                                    </div>
                                </div>
                                <DialogFooter>
                                    {
                                        !isLoading ? (
                                            <Button
                                                onClick={() => {
                                                    console.log(`DORO ${props.id}`)
                                                    setIsLoading(true);

                                                    // TODO: Disconnect (Mock Loading)
                                                    delay(500).finally(() => {
                                                        setIsLoading(false);
                                                        setFinished(true)
                                                    });
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
                                        Good Luck
                                    </DialogTitle>
                                    <div className="grid gap-4 py-4 items-center justify-center">
                                        <PartyPopperIcon />
                                    </div>
                                </DialogHeader>
                                <DialogFooter>
                                    <DialogClose asChild>
                                        <Button
                                            onClick={() => {
                                                console.log(`GoodLuck ${props.id}`)
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

    );
}
