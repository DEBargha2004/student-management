"use server";

import { featureFlags } from "@/db/schema";
import { db } from "@/lib/db";
import { catchError } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function getNewUserRegestrationStatus() {
  const [err, res] = await catchError(
    db
      .select()
      .from(featureFlags)
      .where(eq(featureFlags.id, "NEW_REGESTRATION"))
  );

  if (err) return false;

  return res[0].value ?? false;
}
