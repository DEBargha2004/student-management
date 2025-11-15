"use server";

import { branch } from "@/db/schema";
import { Id } from "@/hooks/use-module-constructor";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionError, actionSuccess, catchError } from "@/lib/utils";

export async function deleteBranch(id: Id) {
  const res = await Action.authenticate(async (auth) => {
    const [err, res] = await catchError(
      db.update(branch).set({ deletedAt: new Date() })
    );

    if (err) return actionError(err.message);

    return actionSuccess({ message: "Branch Deleted Successfully" });
  });

  return res;
}
