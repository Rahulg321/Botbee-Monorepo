import React, { Suspense } from "react";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { AddPromptDialog } from "@/components/dialogs/add-prompt-dialog";
import { Button } from "@/components/ui/button";
import {
  getAllPrompts,
  getAllTemplatePrompts,
  getAllPromptsByUserId,
} from "@/lib/queries";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

// Extracted prompt component
const PromptItem = ({ prompt, href }: { prompt: any; href: string }) => {
  return (
    <Link href={href} className="block group">
      <div className="p-3 rounded-md hover:bg-accent/50 transition-colors">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              {prompt.title}
            </h3>
            {prompt.description && (
              <p className="text-sm text-muted-foreground mt-1">
                {prompt.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

const PromptGalleryPage = async () => {
  const userSession = await auth();

  if (!userSession) redirect("/login");

  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-foreground mb-6">
            Prompts
          </h1>

          <div className="max-w-4xl mx-auto mb-6">
            <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              <span className="text-sm text-muted-foreground">Prompts</span>

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Prompts"
                  className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-ring"
                />
              </div>

              <button className="p-2 hover:bg-accent rounded-md transition-colors">
                <Search className="w-4 h-4 text-muted-foreground" />
              </button>
              <Button
                variant="outline"
                size="icon"
                className="cursor-pointer"
                asChild
              >
                <Link href="/prompt-gallery/create">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </Link>
              </Button>

              {/* <AddPromptDialog /> */}
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4">
                <div className="space-y-2">
                  <Suspense fallback={<div>Loading...</div>}>
                    <FetchPrompts userId={userSession.user.id} />
                  </Suspense>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptGalleryPage;

const FetchPrompts = async ({ userId }: { userId: string }) => {
  const [userPrompts, templatePrompts] = await Promise.all([
    getAllPromptsByUserId(userId),
    getAllTemplatePrompts(),
  ]);

  return (
    <div className="space-y-8">
      {/* User Prompts Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          My Prompts ({userPrompts?.length})
        </h2>
        <div className="space-y-2">
          {userPrompts &&
            userPrompts.map((prompt) => (
              <PromptItem
                key={prompt.id}
                prompt={prompt}
                href={`/prompt-gallery/${prompt.id}`}
              />
            ))}
        </div>
      </div>

      {/* Template Prompts Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Template Prompts ({templatePrompts?.length})
        </h2>
        <div className="space-y-2">
          {templatePrompts && templatePrompts.length > 0 ? (
            templatePrompts.map((prompt) => (
              <PromptItem
                key={prompt.id}
                prompt={prompt}
                href={`/prompt-gallery/${prompt.id}`}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No template prompts available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
