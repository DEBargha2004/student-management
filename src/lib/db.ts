import { env } from "@/lib/env";
import { drizzle } from "drizzle-orm/neon-serverless";

export const db = drizzle(process.env.DB_URL);
