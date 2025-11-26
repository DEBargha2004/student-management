"use server";

import { batch, branch } from "@/db/schema";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";
import { batchSchema, TBatchSchema } from "@/schema/batch";
import { BatchRecord } from "@/types/batch";
import { and, eq, isNull } from "drizzle-orm";

export async function createNewBatch(req: TBatchSchema) {
  return Action.authenticate((auth) => {
    return Action.use(batchSchema, req).next(async (data) => {
      const res = await db.transaction(async (trx) => {
        const _branch = await trx
          .select()
          .from(branch)
          .where(and(eq(branch.id, data.branch), isNull(branch.deletedAt)));

        if (!_branch.length) throw new Error("Branch not found");

        const _batch = await trx
          .insert(batch)
          .values({
            title: data.title,
            branchId: data.branch,
            day: data.day,
            timing: {
              from: data.timing.from,
              to: data.timing.to,
            },
          })
          .returning();

        return { _batch, _branch };
      });

      if (!res._batch.length) throw new Error("Batch could not be created");
      const {
        _batch: [_batch],
        _branch: [_branch],
      } = res;
      return actionSuccess({
        id: _batch.id,
        title: _batch.title,
        branch: {
          id: _branch.id,
          title: _branch.title,
        },
        day: _batch.day,
        timing: _batch.timing,
      } as BatchRecord);
    });
  }, true);
}
