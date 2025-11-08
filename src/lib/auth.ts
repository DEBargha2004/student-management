import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { env } from "./env";
import { nextCookies } from "better-auth/next-js";
import * as authSchema from "@/../auth-schema";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...authSchema,
    },
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: !env.NEW_REGISTRATION,
  },
  plugins: [nextCookies()],
});
