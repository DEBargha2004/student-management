"use server";

import { batch, branch } from "@/db/schema";
import { Id } from "@/hooks/use-module-constructor";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";
import { batchSchema, TBatchSchema } from "@/schema/batch";
import { TBranchSchema } from "@/schema/branch";
import { BatchRecord } from "@/types/batch";
import { eq } from "drizzle-orm";

export async function editBatch(id: Id, data: TBatchSchema) {
  const res = await Action.authenticate(async (auth) => {
    return Action.use(batchSchema, data).next(async (data) => {
      const res = await db.transaction(async (trx) => {
        const _branch = await trx
          .select()
          .from(branch)
          .where(eq(branch.id, Number(data.branch)));
        const _batch = await trx
          .update(batch)
          .set({
            title: data.title,
            branchId: data.branch,
            day: data.day,
            timing: data.timing,
            updatedAt: new Date(),
          })
          .where(eq(batch.id, Number(id)))
          .returning();

        return {
          _batch,
          _branch,
        };
      });
      const {
        _batch: [_batch],
        _branch: [_branch],
      } = res;
      return actionSuccess({
        id: _batch.id,
        branch: {
          id: _branch.id,
          title: _branch.title,
        },
        day: _batch.day,
        title: _batch.title,
        timing: _batch.timing,
      } as BatchRecord);
    });
  });

  return res;
}
