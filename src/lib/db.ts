import { env } from "@/lib/env";
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";

const sql = neon(env.DB_URL);
export const db = drizzle({ client: sql });
