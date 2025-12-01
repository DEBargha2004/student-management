"use server";

import { standard } from "@/db/schema";
import { Id } from "@/hooks/use-module-constructor";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess, catchError } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function deleteStandard(id: Id) {
  const res = Action.authenticate(async (auth) => {
    const res = await db
      .update(standard)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(standard.id, Number(id)));

    return actionSuccess({ message: "Batch Delete Successfully" });
  });

  return res;
}
