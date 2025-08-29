import React from "react";
import { db } from "@repo/db";
import { user } from "@repo/db/schema";
import { auth } from "@/auth";
import { ModeToggle } from "@/components/mode-toggle";
import { redirect } from "next/navigation";

const page = async () => {
  const userSession = await auth();

  if (!userSession) {
    redirect("/login");
  }

  return (
    <div>
      <h1>Hello</h1>
      <ModeToggle />
    </div>
  );
};

export default page;
