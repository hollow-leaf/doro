import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import * as React from "react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";
import { Spinner } from "../Spinner";
import { useEffect, useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";

const formSchema = z.object({
  typeId: z.string().min(1, { message: "Please select type of game" }),
  room: z.string().min(1, { message: "Please set room name" }),
});

export default function NewGameForm({
  className,
  setSheetOpen,
}: {
  className?: string;
  setSheetOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [types, setTypes] = useState(false);

  const [isLoading, setIsLoading] = React.useState(false);

  useEffect(() => {

  }, []);
  // 1. Define your form.
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      typeId: "",
      room: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);
    //TODO: Add Game via mina contract

    setIsLoading(false);
    setSheetOpen(false);
  }
  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-3 py-4"
        >
          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-red-500">* </span>
                  Game Type
                </FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="max-h-40">
                    <ScrollArea className="h-full w-full" type="always">
                      <SelectItem key={0} value={String(0)}>
                        Public
                      </SelectItem>
                      <SelectItem key={1} value={String(1)}>
                        Private
                      </SelectItem>
                    </ScrollArea>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="room"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  <span className="text-red-500">* </span>Room Name
                </FormLabel>
                <FormControl>
                  <Input placeholder="" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            className="mx-auto mb-6 mt-4 h-12 w-[90%]"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Create"}
          </Button>
        </form>
      </Form>
    </>
  );
}
