import { Metadata } from "next";
import React from "react";
import DocumentsDashboard from "./documents-dashboard";
import { auth } from "@/auth";
import {
  fetchBotsWithDocumentsCount,
  getBotDocumentsByUserId,
} from "@/lib/queries";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Bot Documents",
  description: "Bot Documents",
};

const BotDocumentsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { query, page } = await searchParams;
  const currentPage = Number(page) || 1;
  const limit = 50;
  const offset = (currentPage - 1) * limit;
  const userSession = await auth();

  if (!userSession?.user) {
    redirect("/login");
  }

  const botsWithDocumentsCount = await fetchBotsWithDocumentsCount(
    userSession.user.id
  );

  const botDocuments = await getBotDocumentsByUserId(
    userSession.user.id,
    query as string,
    offset,
    limit
  );

  return (
    <div>
      <DocumentsDashboard
        botsWithDocumentsCount={botsWithDocumentsCount}
        botDocuments={botDocuments.documents}
        userSession={userSession}
      />
    </div>
  );
};

export default BotDocumentsPage;
