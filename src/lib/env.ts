import z from "zod";

const envSchema = z.object({
  DB_URL: z.string(),
  BETTER_AUTH_SECRET: z.string(),
  NEXT_PUBLIC_BETTER_AUTH_URL: z.string(),
  NEW_REGISTRATION: z.coerce.boolean(),
});

export const env = envSchema.parse(process.env);

declare global {
  namespace NodeJS {
    interface ProcessEnv extends z.infer<typeof envSchema> {}
  }
}
