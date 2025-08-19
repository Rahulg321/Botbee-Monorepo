import React from "react";
import CharacterChatScreen from "./character-chat-screen";
import { getAiCharacterById } from "@/lib/queries";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";

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
    <div>
      <CharacterChatScreen
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
  );
};

export default page;
