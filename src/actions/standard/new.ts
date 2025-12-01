"use server";

import { standard } from "@/db/schema";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";
import { standardSchema, TStandardSchema } from "@/schema/standard";
import { and, eq, isNull } from "drizzle-orm";

export async function createNewStandard(req: TStandardSchema) {
  return Action.authenticate((auth) => {
    return Action.use(standardSchema, req).next(async (data) => {
      const res = await db
        .insert(standard)
        .values({
          title: data.title,
        })
        .returning();

      if (!res.length) throw new Error("Could not create class");

      return actionSuccess(res[0]);
    });
  }, true);
}
