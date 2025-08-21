import React from "react";
import CharacterChatScreen from "./character-chat-screen";
import { getAiCharacterById } from "@/lib/queries";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import Image from "next/image";

const page = async ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = await params;

  const userSession = await auth();

  if (!userSession) {
    return redirect("/login");
  }

  const character = await getAiCharacterById(id);

  if (!character) {
    return notFound();
  }

  if (character.userId && character.userId !== userSession.user.id) {
    console.log("user is accessing a character which was not created by him");
    return notFound();
  }

  return (
    <div className="flex flex-col h-screen">
      {/* Sticky Character Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex flex-col items-center justify-center ">
          <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-primary/20 shadow-lg">
            <Image
              src={character.imageUrl ?? ""}
              alt={character.name}
              fill
              className="object-cover rounded-full"
              style={{ objectPosition: "center" }}
            />
          </div>
          <div className="mt-2 text-center">
            <h3 className="text-lg font-semibold text-foreground">
              {character.name}
            </h3>
            {character.category?.name && (
              <p className="text-sm text-muted-foreground">
                {character.category.name}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Chat Screen */}
      <div className="flex-1 overflow-hidden">
        <CharacterChatScreen
          characterImageUrl={character.imageUrl || ""}
          characterName={character.name}
          categoryName={character.category?.name || ""}
          description={character.description || ""}
          fullDescription={character.fullDescription || ""}
          personality={character.personality || ""}
          behaviorAndTone={character.behaviorAndTone || ""}
          conversationTone={character.conversationTone || ""}
          systemPrompt={character.systemPrompt || ""}
          brandGuidelines={character.brandGuidelines || ""}
          customGreeting={character.customGreeting || ""}
          starterPrompts={character.prompts || []}
        />
      </div>
    </div>
  );
};

export default page;
