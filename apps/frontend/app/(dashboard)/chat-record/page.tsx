import { auth } from "@/auth";
import { getBotChatHistoryByUserId, getBotChatsByUserId } from "@/lib/queries";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Calendar,
  MessageSquare,
  Bot,
  User,
  Clock,
  Search,
  Filter,
} from "lucide-react";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Chat Record",
  description: "View your bot and character chat history",
};

const page = async () => {
  const userSession = await auth();

  if (!userSession) redirect("/login");

  const botChatHistory = await getBotChatHistoryByUserId(
    userSession.user.id as string
  );

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const groupChatsByDate = (chats: any[]) => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 24 * 60 * 60 * 1000);
    const lastWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const lastMonth = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

    return chats.reduce(
      (groups: any, chat: any) => {
        const chatDate = new Date(chat.createdAt);

        if (chatDate >= today) {
          groups.today.push(chat);
        } else if (chatDate >= yesterday) {
          groups.yesterday.push(chat);
        } else if (chatDate >= lastWeek) {
          groups.lastWeek.push(chat);
        } else if (chatDate >= lastMonth) {
          groups.lastMonth.push(chat);
        } else {
          groups.older.push(chat);
        }

        return groups;
      },
      {
        today: [],
        yesterday: [],
        lastWeek: [],
        lastMonth: [],
        older: [],
      }
    );
  };

  const groupedChats = botChatHistory
    ? groupChatsByDate(botChatHistory)
    : { today: [], yesterday: [], lastWeek: [], lastMonth: [], older: [] };

  const renderChatGroup = (
    title: string,
    chats: any[],
    icon: React.ReactNode
  ) => {
    if (chats.length === 0) return null;

    return (
      <div key={title} className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
          {icon}
          <span>{title}</span>
          <Badge variant="secondary" className="ml-auto">
            {chats.length}
          </Badge>
        </div>
        <div className="space-y-2">
          {chats.map((chat) => (
            <Card
              key={chat.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Bot className="h-4 w-4 text-blue-500" />
                      <h3 className="font-medium text-sm truncate">
                        {chat.title || `Chat ${chat.id.slice(0, 8)}`}
                      </h3>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatDate(chat.createdAt)}
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="ml-2" asChild>
                    <Link href={`/embed/${chat.botId}/${chat.id}`}>View</Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Chat Records</h1>
        <p className="text-muted-foreground">
          View and manage your conversation history with bots and characters
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Chats</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {botChatHistory?.length || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              All time conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">This Week</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groupedChats.lastWeek.length +
                groupedChats.today.length +
                groupedChats.yesterday.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Recent conversations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today</CardTitle>
            <Bot className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {groupedChats.today.length}
            </div>
            <p className="text-xs text-muted-foreground">
              Today's conversations
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search chat history..."
                className="w-full pl-10 pr-4 py-2 border border-input rounded-md bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              />
            </div>
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Chat History Sections */}
      <div className="space-y-6">
        {renderChatGroup(
          "Today",
          groupedChats.today,
          <Calendar className="h-4 w-4" />
        )}
        {renderChatGroup(
          "Yesterday",
          groupedChats.yesterday,
          <Calendar className="h-4 w-4" />
        )}
        {renderChatGroup(
          "Last Week",
          groupedChats.lastWeek,
          <Calendar className="h-4 w-4" />
        )}
        {renderChatGroup(
          "Last Month",
          groupedChats.lastMonth,
          <Calendar className="h-4 w-4" />
        )}
        {renderChatGroup(
          "Older",
          groupedChats.older,
          <Calendar className="h-4 w-4" />
        )}

        {(!botChatHistory || botChatHistory.length === 0) && (
          <Card>
            <CardContent className="p-8 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No chat history yet</h3>
              <p className="text-muted-foreground mb-4">
                Start a conversation with a bot or character to see your chat
                history here.
              </p>
              <Button>Start Chatting</Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Character Chat History Section */}
      <div className="space-y-4">
        <Separator />
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <User className="h-5 w-5 text-purple-500" />
            <span>Character Chat History</span>
          </div>
          <Card>
            <CardContent className="p-6 text-center">
              <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">
                Character chats coming soon
              </h3>
              <p className="text-muted-foreground">
                Your character conversation history will appear here.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default page;
