import { Button } from "@/components/ui/button";
import { auth } from "@/auth";
import { DeletePromptAlert } from "@/components/dialogs/delete-prompt-alert";
import { getPromptById } from "@/lib/queries";
import { ArrowLeft, Copy, Heart, Share2 } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import React from "react";

const SinglePromptPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const userSession = await auth();

  if (!userSession) redirect("/login");

  const foundPrompt = await getPromptById(id);

  if (!foundPrompt) {
    notFound();
  }

  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="border-b border-border">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-center gap-4">
              <Button asChild>
                <Link href="/prompt-gallery">
                  <ArrowLeft className="w-4 h-4" />
                </Link>
              </Button>

              <div>
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-foreground">
                    {foundPrompt.title}
                  </h1>
                </div>

                <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                  <span className="px-2 py-1 bg-accent text-accent-foreground rounded-md">
                    {foundPrompt.category?.name}
                  </span>
                </div>

                <p className="text-muted-foreground max-w-2xl">
                  {foundPrompt.description}
                </p>
              </div>
            </div>
          </div>
        </div>

        {foundPrompt.userId && foundPrompt.userId === userSession?.user?.id && (
          <div>
            <DeletePromptAlert promptId={id} />
          </div>
        )}

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <div className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-semibold text-foreground">
                      Prompt
                    </h2>
                    <button className="flex items-center gap-2 px-3 py-2 bg-primary text-primary-foreground hover:bg-primary/90 rounded-md transition-colors">
                      <Copy className="w-4 h-4" />
                      <span className="text-sm">Copy</span>
                    </button>
                  </div>

                  <div className="bg-muted/50 border border-border rounded-lg p-4">
                    <pre className="whitespace-pre-wrap text-sm text-foreground font-mono leading-relaxed">
                      {foundPrompt.content}
                    </pre>
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SinglePromptPage;
