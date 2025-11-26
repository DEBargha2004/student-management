"use server";

import { BranchSearchParamProps } from "@/app/(app)/branch/_components/fetcher";
import { branch } from "@/db/schema";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";
import { and, desc, gt, isNull, or, sql } from "drizzle-orm";

export async function getBranches(props: BranchSearchParamProps) {
  const res = await Action.authenticate(async (auth) => {
    const res = await db
      .select({
        id: branch.id,
        title: branch.title,
        address: branch.address,
        count: sql<number>`count(*) over()::int`,
      })
      .from(branch)
      .where(
        and(
          isNull(branch.deletedAt),
          ...(props.q
            ? [
                or(
                  gt(sql`SIMILARITY(${branch.title}, ${props.q})`, 0.2),
                  gt(sql`SIMILARITY(${branch.address}, ${props.q})`, 0.2)
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
                SIMILARITY(${branch.title}, ${props.q}),
                SIMILARITY(${branch.address}, ${props.q})
              )
            `
            )
          : desc(branch.createdAt)
      );

    return actionSuccess({
      records: res,
      count: res[0]?.count ?? 0,
    });
  }, true);

  return res;
}
