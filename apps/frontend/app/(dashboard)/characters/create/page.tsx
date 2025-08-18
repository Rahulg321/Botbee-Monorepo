import { auth } from "@/auth";
import CreateCharacterForm from "@/components/forms/create-character-form";
import React from "react";
import { redirect } from "next/navigation";
import { getAiCharacterCategories } from "@/lib/queries";

export const metadata = {
  title: "Create Character",
  description: "Create a new character",
};

const CreateCharacterPage = async () => {
  const userSession = await auth();

  if (!userSession) redirect("/login");

  const characterCategories = await getAiCharacterCategories();

  if (!characterCategories) {
    return <div>No character categories found</div>;
  }

  return (
    <div>
      <CreateCharacterForm
        userId={userSession.user.id}
        characterCategories={characterCategories}
      />
    </div>
  );
};

export default CreateCharacterPage;
