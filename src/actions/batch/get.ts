"use server";

import { BatchSearchParamProps } from "@/app/(app)/batch/_components/fetcher";
import { batch, branch } from "@/db/schema";
import { Id } from "@/hooks/use-module-constructor";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";
import { BatchRecord } from "@/types/batch";
import { and, desc, eq, gt, isNull, or, sql } from "drizzle-orm";

type BranchInfo = BatchRecord["branch"];

export async function getBatches(
  props: BatchSearchParamProps & { branchId?: Id }
) {
  const res = Action.authenticate(async (auth) => {
    const res = await db
      .select({
        id: batch.id,
        title: batch.title,
        count: sql<number>`count(*) over()::int`,
        day: batch.day,
        timing: batch.timing,
        branch: sql<BranchInfo>`
            json_build_object(
                'id', ${branch.id},
                'title', ${branch.title}
            )
        `,
      })
      .from(batch)
      .leftJoin(branch, eq(branch.id, batch.branchId))
      .where(
        and(
          isNull(batch.deletedAt),
          isNull(branch.deletedAt),
          ...(props.branchId ? [eq(branch.id, Number(props.branchId))] : []),
          ...(props.q
            ? [
                or(
                  gt(sql`SIMILARITY(${batch.title}, ${props.q})`, 0.2),
                  gt(sql`SIMILARITY(${batch.day}, ${props.q})`, 0.2),
                  gt(sql`SIMILARITY(${branch.title}, ${props.q})`, 0.2)
                ),
              ]
            : [])
        )
      )
      .orderBy(
        props.q
          ? desc(
              sql`
                GREATEST(
                    SIMILARITY(${batch.title}, ${props.q}),
                    SIMILARITY(${batch.day}, ${props.q}),
                    SIMILARITY(${branch.title}, ${props.q})

                )
                    `
            )
          : desc(batch.createdAt)
      )
      .offset(props.limit * (props.page - 1))
      .limit(props.limit);

    return actionSuccess({
      records: res,
      count: res[0]?.count ?? 0,
    });
  }, true);

  return res;
}
