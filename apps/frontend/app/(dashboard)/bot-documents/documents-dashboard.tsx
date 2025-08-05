"use client";

import { useTransition, useState } from "react";
import {
  Search,
  Plus,
  Trash2,
  Edit,
  RefreshCw,
  FileText,
  Link,
  FileArchive,
  Link2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { BotDocument, BotWithDocumentsCount } from "@repo/shared/types";
import { useRouter } from "next/navigation";
import SearchDocumentFilter from "@/app/(dashboard)/bot-documents/search-document-filter";
import AddDocumentDialog from "./add-document-dialog";
import { Session } from "next-auth";
import AddAudioDialog from "./add-audio-dialog";
import AddUrlDialog from "./add-url-dialog";
import { deleteBotResourceServerAction } from "@/lib/actions/delete-bot-resource";

const getFileIcon = (fileType: string) => {
  switch (fileType) {
    case "pdf":
      return <FileText className="size-4 text-primary" />;
    case "doc":
    case "docx":
      return <FileText className="size-4 text-accent-foreground" />;
    case "txt":
      return <FileText className="size-4 text-muted-foreground" />;
    case "zip":
      return (
        <FileArchive className="size-4 text-yellow-500 dark:text-yellow-400" />
      );
    case "url":
      return <Link2 className="size-4 text-accent-foreground" />;
    default:
      return <FileText className="size-4 text-muted-foreground" />;
  }
};

export default function DocumentsDashboard({
  botsWithDocumentsCount,
  botDocuments,
  userSession,
}: {
  botsWithDocumentsCount: BotWithDocumentsCount;
  botDocuments: BotDocument;
  userSession: Session;
}) {
  const router = useRouter();
  const [selectedBot, setSelectedBot] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isAlertDialogOpen, setIsAlertDialogOpen] = useState(false);

  const [isDeleting, startDeleting] = useTransition();

  // If no bots, show empty state
  if (!botsWithDocumentsCount || botsWithDocumentsCount.length === 0) {
    return (
      <div className="space-y-6 bg-background min-h-screen flex flex-col items-center justify-center">
        <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium text-foreground mb-2">
          No bots created yet
        </h3>
        <p className="text-muted-foreground mb-4">
          You haven&apos;t created any bots yet. Create a bot to start adding
          documents.
        </p>
        <Button onClick={() => router.push("/create-new-bot")}>
          <Plus className="size-4 mr-2" />
          Create Bot
        </Button>
      </div>
    );
  }

  const filteredDocuments = botDocuments?.filter((doc) => {
    const matchesBot = selectedBot === "all" || doc.botId === selectedBot;
    const matchesSearch = doc.fileName
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesBot && matchesSearch;
  });

  const selectedBotData = botsWithDocumentsCount?.find(
    (bot) => bot.id === selectedBot
  );

  const totalDocuments =
    selectedBot === "all"
      ? botDocuments?.length
      : botDocuments?.filter((doc) => doc.botId === selectedBot).length;

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedDocuments(filteredDocuments?.map((doc) => doc.id) || []);
    } else {
      setSelectedDocuments([]);
    }
  };

  const handleSelectDocument = (documentId: string, checked: boolean) => {
    if (checked) {
      setSelectedDocuments([...selectedDocuments, documentId]);
    } else {
      setSelectedDocuments(selectedDocuments.filter((id) => id !== documentId));
    }
  };

  const handleDeleteSelected = () => {
    // Implementation for deleting selected documents
    console.log("Deleting documents:", selectedDocuments);
    setSelectedDocuments([]);
  };

  return (
    <div className="p-6 space-y-6 bg-background min-h-screen">
      <div className="bg-card rounded-lg shadow-sm border">
        {/* Header */}
        <div className="p-6 border-b border-border space-y-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-2">
            <h1 className="text-2xl font-semibold text-foreground">
              Documents
            </h1>
            {selectedBot !== "all" && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="size-4 mr-2" />
                    Delete Bot
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Delete Bot</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to delete this bot? This action
                      cannot be undone and will remove all associated documents.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className="bg-destructive hover:bg-destructive/80">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>

          {/* Bot Selection and Controls */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Select value={selectedBot} onValueChange={setSelectedBot}>
                  <SelectTrigger className="w-full sm:w-48 min-w-[140px]">
                    <SelectValue placeholder="Select a bot" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Bots</SelectItem>
                    {botsWithDocumentsCount?.map((bot) => (
                      <SelectItem key={bot.id} value={bot.id}>
                        {bot.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {selectedBot !== "all" && (
                  <Button variant="ghost" size="sm">
                    <Edit className="size-4" />
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1 sm:mt-0">
                <span>{totalDocuments} documents</span>
                {selectedBotData && (
                  <Badge variant="secondary">{selectedBotData.name}</Badge>
                )}
              </div>
            </div>
          </div>

          {/* Search and Action Bar */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 w-full mt-2">
            <div className="flex flex-col sm:flex-row gap-2 flex-1 w-full">
              <SearchDocumentFilter />
              {selectedDocuments.length > 0 && (
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Trash2 className="size-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Documents</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete{" "}
                        {selectedDocuments.length} selected document(s)? This
                        action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteSelected}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              )}
            </div>

            <div className="flex flex-row flex-wrap gap-2 items-center mt-2 md:mt-0">
              <AddDocumentDialog
                botsWithDocumentsCount={botsWithDocumentsCount}
                userSession={userSession}
              />
              <AddUrlDialog
                botsWithDocumentsCount={botsWithDocumentsCount}
                userSession={userSession}
              />
              <AddAudioDialog
                botsWithDocumentsCount={botsWithDocumentsCount}
                userSession={userSession}
              />
            </div>
          </div>
        </div>

        <div className="overflow-x-auto group-has-[[data-pending]]:animate-pulse">
          <Table className="min-w-full">
            <TableHeader>
              <TableRow className="bg-muted">
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      selectedDocuments.length === filteredDocuments?.length &&
                      filteredDocuments?.length > 0
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead className="min-w-[180px]">File Name</TableHead>
                <TableHead className="min-w-[120px]">Bot</TableHead>
                <TableHead className="min-w-[120px]">Upload Date</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredDocuments?.map((document) => (
                <TableRow key={document.id} className="hover:bg-muted/60">
                  <TableCell>
                    <Checkbox
                      checked={selectedDocuments.includes(document.id)}
                      onCheckedChange={(checked) =>
                        handleSelectDocument(document.id, checked as boolean)
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3 min-w-0">
                      {getFileIcon(document.fileType)}
                      <div className="truncate">
                        <div className="font-medium truncate max-w-[180px]">
                          {document.fileName}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">{document.botName}</Badge>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {document.createdAt.toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Document</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete &quot;
                            {document.fileName}&quot;? This action cannot be
                            undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <Button
                            onClick={async () => {
                              startDeleting(async () => {
                                const response =
                                  await deleteBotResourceServerAction(
                                    document.id
                                  );

                                console.log(response);

                                if (response.type === "success") {
                                  toast.success(
                                    "Document deleted successfully"
                                  );
                                  setIsAlertDialogOpen(false);
                                } else {
                                  toast.error(
                                    response.message ||
                                      "Failed to delete document"
                                  );
                                }
                              });
                            }}
                            disabled={isDeleting}
                            className="bg-destructive hover:bg-destructive/80"
                          >
                            {isDeleting ? (
                              <div className="flex items-center gap-2">
                                <Loader2 className="size-4 animate-spin" />
                                Deleting...
                              </div>
                            ) : (
                              "Delete"
                            )}
                          </Button>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredDocuments?.length === 0 && (
          <div className="text-center py-12">
            <FileText className="size-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              No documents found
            </h3>
            <p className="text-muted-foreground mb-4">
              {searchQuery
                ? `No documents match your search "${searchQuery}"`
                : selectedBot === "all"
                  ? "You haven't added any documents yet"
                  : `No documents found for ${selectedBotData?.name}`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
