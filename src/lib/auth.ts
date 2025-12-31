import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { db } from "./db";
import { env } from "./env";
import { nextCookies } from "better-auth/next-js";
import * as authSchema from "@/../auth-schema";
import { getNewUserRegestrationStatus } from "@/actions/feature-flags/get";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      ...authSchema,
    },
  }),
  emailAndPassword: {
    enabled: true,
    disableSignUp: !(await getNewUserRegestrationStatus()),
  },
  plugins: [nextCookies()],
});
