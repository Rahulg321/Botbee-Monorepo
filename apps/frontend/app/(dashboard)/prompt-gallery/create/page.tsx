import { auth } from "@/auth";
import CreatePromptForm from "@/components/forms/create-prompt-form";
import { Button } from "@/components/ui/button";
import { getPromptCategories } from "@/lib/queries";
import { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Create Prompt",
  description: "Create a new prompt",
};

const CreatePromptPage = async () => {
  const userSession = await auth();

  if (!userSession) redirect("/login");

  const promptCategories = await getPromptCategories();

  if (!promptCategories) redirect("/prompt-gallery");

  return (
    <div>
      <Button asChild>
        <Link href="/prompt-gallery">Go Back</Link>
      </Button>

      <CreatePromptForm
        userId={userSession.user.id}
        promptCategories={promptCategories}
      />
    </div>
  );
};

export default CreatePromptPage;
