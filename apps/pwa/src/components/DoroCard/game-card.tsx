import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
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

type GameCardProps = React.ComponentProps<typeof Card> & {
    id: string,
    prize: string,
    type: string,
    fee: number,
    seatLimit: number,
    emptySeat: number,
    creator: string
};

export function GameCard({ className, ...props }: GameCardProps) {
    return (
        <Dialog>
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
                    <Button
                        onClick={() => {
                            console.log(`DORO ${props.id}`)
                        }}>DORO
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>

    );
}
