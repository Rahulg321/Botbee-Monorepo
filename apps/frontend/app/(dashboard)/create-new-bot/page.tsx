import React from "react";
import CreateBotMultistepForm from "./create-bot-multistep-form";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getBotTemplates } from "@/lib/queries";

export const metadata = {
  title: "Create New Bot",
  description: "Create a new bot",
};

const CreateNewBotPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const params = await searchParams;
  const currentStep = Number.parseInt((params.step as string) || "1");

  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  const botTemplates = await getBotTemplates();

  return (
    <div>
      <CreateBotMultistepForm
        currentStep={currentStep}
        userSession={session}
        userId={session.user.id}
        templates={botTemplates!}
      />
    </div>
  );
};

export default CreateNewBotPage;
