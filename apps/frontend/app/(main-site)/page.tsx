import React from "react";
import { db } from "@repo/db";
import { user } from "@repo/db/schema";
import { auth } from "@/auth";
import { ModeToggle } from "@/components/mode-toggle";

const page = async () => {
  const userSession = await auth();
  console.log(userSession);

  return (
    <div>
      <h1>Hello</h1>
      <ModeToggle />
    </div>
  );
};

export default page;
