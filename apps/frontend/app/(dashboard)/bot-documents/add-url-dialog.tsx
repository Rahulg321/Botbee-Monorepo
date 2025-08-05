"use client";

import { useState, useTransition } from "react";
import { FileText, Loader2, Plus } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { BotWithDocumentsCount } from "@repo/shared/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Session } from "next-auth";
import { toast } from "sonner";
import axios from "axios";
import { newUrlFormSchema } from "@/lib/schemas/new-url-form-schema";

const AddUrlDialog = ({
  botsWithDocumentsCount,
  userSession,
}: {
  botsWithDocumentsCount: BotWithDocumentsCount;
  userSession: Session;
}) => {
  const [isPending, startTransition] = useTransition();
  const [open, setOpen] = useState(false);

  const form = useForm<z.infer<typeof newUrlFormSchema>>({
    resolver: zodResolver(newUrlFormSchema),
    defaultValues: {
      url: "",
      botId: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof newUrlFormSchema>) => {
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.append("url", values.url);
        formData.append("botId", values.botId);
        formData.append("userId", userSession.user?.id as string);

        const response = await axios.post(`/api/add-url-resource`, formData, {
          headers: {
            Authorization: `Bearer ${userSession.user?.accessToken}`,
          },
        });

        if (response.status !== 200) {
          throw new Error("Failed to process file");
        }

        toast.success("Successful!!", {
          description: `${values.url} created successfully`,
        });
        form.reset();
        setOpen(false);
      } catch (err) {
        toast.error("Failed to create resource. Please try again.");
        console.error(err);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="size-4 mr-2" />
          Add URL
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add URL</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="botId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bot</FormLabel>
                    <FormDescription>
                      This is the bot that will be used to add the url resource.
                    </FormDescription>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a bot" />
                        </SelectTrigger>
                        <SelectContent>
                          {botsWithDocumentsCount?.map((bot) => (
                            <SelectItem key={bot.id} value={bot.id}>
                              {bot.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL</FormLabel>
                    <FormDescription>
                      This is the url of the resource.
                    </FormDescription>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="https://www.google.com"
                        className="placeholder:text-muted-foreground"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isPending} className="shrink-0">
                {isPending ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  <>Submit</>
                )}
              </Button>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddUrlDialog;
