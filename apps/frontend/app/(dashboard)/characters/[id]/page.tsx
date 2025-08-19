import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Users,
  Thermometer,
  MessageSquare,
  Settings,
  Zap,
} from "lucide-react";
import Link from "next/link";
import { getAiCharacterById } from "@/lib/queries";
import { DeleteCharacterAlert } from "@/components/dialogs/delete-character-alert";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;

  const characterModel = await getAiCharacterById(id);

  return {
    title: characterModel?.name || "Character",
    description: characterModel?.description || "Character Description",
  };
};

const SingleCharacterPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const userSession = await auth();

  if (!userSession) redirect("/login");

  const { id } = await params;
  const characterModel = await getAiCharacterById(id);

  if (!characterModel) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Model Not Found
          </h1>
          <Button variant="outline" asChild>
            <Link href="/characters">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Characters
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="border-b border-border/40">
          <div className="max-w-4xl mx-auto px-6 py-4">
            <div className="flex items-center gap-4">
              <Link href="/characters">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground font-medium">
                  CHARACTER
                </span>
              </div>
            </div>
          </div>
        </div>

        {characterModel.userId &&
          characterModel.userId === userSession?.user?.id && (
            <div className="max-w-4xl mx-auto px-6 py-4">
              <DeleteCharacterAlert characterId={id} />
            </div>
          )}

        <div className="max-w-4xl mx-auto   space-y-8">
          <div className="text-center space-y-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                {characterModel.name}
              </h1>
              <p className="text-muted-foreground">
                {characterModel.description}
              </p>
            </div>
            <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
              <Badge variant="outline">{characterModel.category?.name}</Badge>
            </div>
            <Button size="lg" className="mt-4" asChild>
              <Link href={`/characters/${id}/chat`}>
                <Users className="w-4 h-4 mr-2" />
                Start Conversation
              </Link>
            </Button>
          </div>

          <div className="space-y-6">
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <MessageSquare className="w-5 h-5" />
                About
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {characterModel.fullDescription}
              </p>
            </section>

            {/* Custom Greeting */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Custom Greeting
              </h2>
              <div className="bg-muted/30 border border-border/50 rounded-lg p-4">
                <p className="text-foreground italic">
                  "{characterModel.customGreeting}"
                </p>
              </div>
            </section>

            {/* System Prompt */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Settings className="w-5 h-5" />
                System Prompt
              </h2>
              <div className="bg-muted/20 border border-border/30 rounded-lg p-4">
                <p className="text-sm text-muted-foreground font-mono leading-relaxed">
                  {characterModel.systemPrompt}
                </p>
              </div>
            </section>

            {/* Personality & Behavior */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Personality
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {characterModel.personality}
              </p>

              <h3 className="text-lg font-medium text-foreground mb-2">
                Behavior & Tone
              </h3>
              <p className="text-muted-foreground leading-relaxed mb-4">
                {characterModel.behaviorAndTone}
              </p>

              <h3 className="text-lg font-medium text-foreground mb-2">
                Conversation Style
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {characterModel.conversationTone}
              </p>
            </section>

            {/* Brand Guidelines */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Zap className="w-5 h-5" />
                Brand Guidelines
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {characterModel.brandGuidelines}
              </p>
            </section>

            {/* Technical Specifications */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3 flex items-center gap-2">
                <Thermometer className="w-5 h-5" />
                Technical Specifications
              </h2>
            </section>

            {/* Conversation Starters */}
            <section>
              <h2 className="text-xl font-semibold text-foreground mb-3">
                Conversation Starters
              </h2>
              <div className="space-y-3">
                {characterModel.prompts.map((prompt, index) => (
                  <div
                    key={index}
                    className="p-4 rounded-lg bg-muted/30 border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer"
                  >
                    <p className="text-foreground">"{prompt}"</p>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SingleCharacterPage;
