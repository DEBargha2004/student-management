"use server";

import { standard } from "@/db/schema";
import { Id } from "@/hooks/use-module-constructor";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";
import { standardSchema, TStandardSchema } from "@/schema/standard";
import { eq } from "drizzle-orm";

export async function editStandard(id: Id, data: TStandardSchema) {
  const res = await Action.authenticate(async (auth) => {
    return Action.use(standardSchema, data).next(async (data) => {
      const res = await db
        .update(standard)
        .set({
          title: data.title,
        })
        .where(eq(standard.id, Number(id)))
        .returning();

      if (!res.length) throw new Error("Could not update Class");

      return actionSuccess(res[0]);
    });
  });

  return res;
}
