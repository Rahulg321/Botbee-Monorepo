import React from "react";
import { db } from "@repo/db";
import { user } from "@repo/db/schema";
import { auth } from "@/auth";

const page = async () => {
  const userSession = await auth();
  console.log(userSession);

  return (
    <div>
      <h1>Hello</h1>
      {JSON.stringify(userSession)}
    </div>
  );
};

export default page;
