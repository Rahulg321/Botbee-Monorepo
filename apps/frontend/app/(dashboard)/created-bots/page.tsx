import { auth } from "@/auth";
import { getCreatedBotsByUserId } from "@/lib/queries";
import { Bot } from "@repo/db/schema";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Bot as BotIcon, Settings, ExternalLink, Edit3 } from "lucide-react";

export const metadata: Metadata = {
  title: "Created Bots",
  description: "Created Bots",
};

const CreatedBotsPage = async () => {
  const userSession = await auth();
  if (!userSession?.user) {
    redirect("/login");
  }

  return (
    <div className="block-space-mini big-container">
      <div className="space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Created Bots</h1>
          <p className="text-muted-foreground">
            Manage and configure your AI chatbot assistants
          </p>
        </div>

        <Suspense fallback={<BotCardsSkeleton />}>
          <DisplayBotByUser userId={userSession.user.id} />
        </Suspense>
      </div>
    </div>
  );
};

export default CreatedBotsPage;

async function DisplayBotByUser({ userId }: { userId: string }) {
  const createdBots = await getCreatedBotsByUserId(userId);

  if (!createdBots || createdBots.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="mx-auto size-16 bg-muted rounded-full flex items-center justify-center mb-4">
          <BotIcon className="size-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-semibold mb-2">No bots created yet</h3>
        <p className="text-muted-foreground mb-6">
          Create your first AI chatbot to get started
        </p>
        <Button asChild>
          <Link href="/create-new-bot">Create Your First Bot</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {createdBots?.map((bot) => {
        return <BotCard key={bot.id} bot={bot} />;
      })}
    </div>
  );
}

function BotCard({ bot }: { bot: Bot }) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 border-border/50 hover:border-border">
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="size-10 bg-primary/10 rounded-lg flex items-center justify-center">
              <BotIcon className="size-5 text-primary" />
            </div>
            <div className="space-y-1">
              <CardTitle className="text-lg font-semibold line-clamp-1">
                {bot.name}
              </CardTitle>
              <Badge variant="secondary" className="text-xs">
                Active
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pb-4">
        <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
          {bot.description || "No description available"}
        </p>
      </CardContent>

      <CardFooter className="pt-0">
        <div className="flex flex-col gap-2 w-full">
          <div className="flex gap-2">
            <Button asChild size="sm" variant="outline" className="flex-1">
              <Link
                href={`/created-bots/${bot.id}`}
                className="flex items-center gap-2"
              >
                <Settings className="size-4" />
                Configure
              </Link>
            </Button>
            <Button asChild size="sm" className="flex-1">
              <Link
                href={`/embed/${bot.id}`}
                className="flex items-center gap-2"
              >
                <ExternalLink className="size-4" />
                View Live
              </Link>
            </Button>
          </div>
          <Button asChild size="sm" variant="ghost" className="w-full">
            <Link
              href={`/created-bots/${bot.id}/edit`}
              className="flex items-center gap-2"
            >
              <Edit3 className="size-4" />
              Edit Bot
            </Link>
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}

function BotCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, i) => (
        <Card key={i} className="animate-pulse">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="size-10 bg-muted rounded-lg" />
                <div className="space-y-2">
                  <div className="h-5 bg-muted rounded w-24" />
                  <div className="h-4 bg-muted rounded w-16" />
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <div className="space-y-2">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </CardContent>
          <CardFooter className="pt-0">
            <div className="flex flex-col gap-2 w-full">
              <div className="flex gap-2">
                <div className="h-8 bg-muted rounded flex-1" />
                <div className="h-8 bg-muted rounded flex-1" />
              </div>
              <div className="h-8 bg-muted rounded w-full" />
            </div>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
}
