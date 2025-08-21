import React from "react";
import { getAiCharacterById, getAiCharacterCategories } from "@/lib/queries";
import { notFound, redirect } from "next/navigation";
import EditCharacterForm from "@/components/forms/edit-character-form";
import { auth } from "@/auth";
import BackButton from "@/components/buttons/back-button";

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  return { title: `Edit Character ${id}` };
};

const EditCharacterPage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const { id } = await params;
  const userSession = await auth();

  if (!userSession) redirect("/login");

  const [characterCategories, characterModel] = await Promise.all([
    getAiCharacterCategories(),
    getAiCharacterById(id),
  ]);

  if (!characterModel || !characterCategories) {
    notFound();
  }

  return (
    <div>
      <BackButton />
      <EditCharacterForm
        characterId={id}
        userId={userSession.user.id}
        characterCategories={characterCategories}
        characterName={characterModel.name}
        characterDescription={characterModel.description ?? ""}
        characterFullDescription={characterModel.fullDescription ?? ""}
        characterPersonality={characterModel.personality ?? ""}
        characterBehaviorAndTone={characterModel.behaviorAndTone ?? ""}
        characterConversationTone={characterModel.conversationTone ?? ""}
        characterSystemPrompt={characterModel.systemPrompt ?? ""}
        characterBrandGuidelines={characterModel.brandGuidelines ?? ""}
        characterCustomGreeting={characterModel.customGreeting ?? ""}
        characterPrompts={characterModel.prompts}
        characterCategoryId={characterModel.category?.id ?? ""}
        characterStatus={
          characterModel.status as "draft" | "published" | "archived"
        }
        characterImage={characterModel.imageUrl ?? ""}
      />
    </div>
  );
};

export default EditCharacterPage;
