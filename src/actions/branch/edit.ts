"use server";

import { branch } from "@/db/schema";
import { Id } from "@/hooks/use-module-constructor";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionError, actionSuccess, catchError } from "@/lib/utils";
import { branchSchema, TBranchSchema } from "@/schema/branch";
import { eq } from "drizzle-orm";

export async function editBranch(id: Id, data: TBranchSchema) {
  const res = await Action.authenticate((auth) => {
    return Action.use(branchSchema, data).next(async (data) => {
      const [err, res] = await catchError(
        db
          .update(branch)
          .set({ ...data, updateAt: new Date() })
          .where(eq(branch.id, Number(id)))
          .returning()
      );

      if (err) return actionError(err.message);

      return actionSuccess(res[0]);
    });
  });

  return res;
}
