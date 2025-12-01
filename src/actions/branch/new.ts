"use server";

import { branch } from "@/db/schema";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionError, actionSuccess, catchError } from "@/lib/utils";
import { branchSchema, TBranchSchema } from "@/schema/branch";

export async function createNewBranch(req: TBranchSchema) {
  return Action.authenticate((auth) => {
    return Action.use(branchSchema, req).next(async (p) => {
      const res = await db
        .insert(branch)
        .values({
          title: p.title,
          address: p.address,
        })
        .returning();

      if (!res.length) throw new Error("Could not create Branch");

      return actionSuccess(res[0]);
    });
  });
}
