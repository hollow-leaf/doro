import { BellRing, Check, Container } from "lucide-react";

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

type PublicCardProps = React.ComponentProps<typeof Card> & {
    id: string,
    prize: string,
    type: string,
    fee: number,
    seatLimit: number,
    emptySeat: number,
    creator: string
};

export function PublicCard({ className, ...props }: PublicCardProps) {
    return (
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
                    <div className="pb-4 border-b">{props.title}</div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <>{props.prize}</>
            </CardContent>
            <CardFooter className="flex justify-end">
                {props.creator}
            </CardFooter>
        </Card>
    );
}
