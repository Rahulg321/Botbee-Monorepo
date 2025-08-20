import React, { Suspense } from "react";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import {
  getAiCharactersByUserId,
  getTemplateAiCharacters,
} from "@/lib/queries";

// Extracted character component
const CharacterItem = ({
  character,
  href,
}: {
  character: any;
  href: string;
}) => {
  return (
    <Link href={href} className="block group">
      <Card className="group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl border-0 overflow-hidden bg-gradient-to-br from-card to-muted/20">
        <CardContent className="p-0">
          <div
            className={`relative h-48 bg-gradient-to-br ${character.gradient} overflow-hidden`}
          >
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300" />
            <Badge
              variant="secondary"
              className="absolute top-3 right-3 bg-white/90 text-gray-800 hover:bg-white"
            >
              {character.category.name}
            </Badge>
          </div>

          <div className="p-6">
            <div className="flex items-start justify-between mb-3">
              <h3 className="font-semibold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                {character.name}
              </h3>
            </div>

            <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
              {character.description}
            </p>

            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground font-medium">
                {character.creator}
              </span>
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

const CharactersPage = async () => {
  const userSession = await auth();

  if (!userSession) redirect("/login");

  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-center text-foreground mb-6">
            Characters
          </h1>

          <div className="max-w-6xl mx-auto mb-6">
            <div className="flex items-center gap-3 p-3 bg-card border border-border rounded-lg">
              <span className="text-sm text-muted-foreground">Characters</span>

              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Search Characters"
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
                <Link href="/characters/create">
                  <Plus className="w-4 h-4 text-muted-foreground" />
                </Link>
              </Button>
            </div>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="bg-card border border-border rounded-lg">
              <div className="p-4">
                <div className="space-y-2">
                  <Suspense fallback={<div>Loading...</div>}>
                    <FetchCharacters userId={userSession.user.id} />
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

export default CharactersPage;

const FetchCharacters = async ({ userId }: { userId: string }) => {
  const [aiCharacters, userCharacters] = await Promise.all([
    getTemplateAiCharacters(),
    getAiCharactersByUserId(userId),
  ]);

  return (
    <div className="space-y-8">
      {/* User Characters Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          My Characters ({userCharacters?.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userCharacters &&
            userCharacters.map((character) => (
              <CharacterItem
                key={character.id}
                character={character}
                href={`/characters/${character.id}`}
              />
            ))}
        </div>
      </div>

      {/* AI Generated Characters Section */}
      <div>
        <h2 className="text-xl font-semibold text-foreground mb-4">
          Template Characters ({aiCharacters?.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {aiCharacters && aiCharacters.length > 0 ? (
            aiCharacters.map((character) => (
              <CharacterItem
                key={character.id}
                character={character}
                href={`/characters/${character.id}`}
              />
            ))
          ) : (
            <p className="text-muted-foreground text-center py-4">
              No AI generated characters available.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
