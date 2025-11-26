"use server";

import { batch } from "@/db/schema";
import { Id } from "@/hooks/use-module-constructor";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess, catchError } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function deleteBatch(id: Id) {
  const res = Action.authenticate(async (auth) => {
    const [err, res] = await catchError(
      db
        .update(batch)
        .set({
          deletedAt: new Date(),
        })
        .where(eq(batch.id, Number(id)))
    );

    if (err) throw new Error(err.message);

    return actionSuccess({ message: "Batch Delete Successfully" });
  });

  return res;
}
