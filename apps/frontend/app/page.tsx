import React from "react";
import { db } from "@repo/db";
import { user } from "@repo/db/schema";

const page = async () => {
  const result = await db.select().from(user);
  return (
    <div>
      {result.map((user) => (
        <div key={user.id}>{user.name}</div>
      ))}
    </div>
  );
};

export default page;
