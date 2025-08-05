import NextAuth, { type NextAuthResult } from "next-auth";
import { db } from "@repo/db";
import { authConfig } from "./auth.config";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { accounts, sessions, user } from "@repo/db/schema";

const result = NextAuth({
  adapter: DrizzleAdapter(db, {
    usersTable: user,
    accountsTable: accounts,
    sessionsTable: sessions,
  }),
  session: { strategy: "jwt" },
  ...authConfig,
  providers: [...authConfig.providers],
});

export const handlers: NextAuthResult["handlers"] = result.handlers;
export const auth: NextAuthResult["auth"] = result.auth;
export const signIn: NextAuthResult["signIn"] = result.signIn;
export const signOut: NextAuthResult["signOut"] = result.signOut;
