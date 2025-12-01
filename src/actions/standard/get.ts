"use server";

import { StandardSearchParamProps } from "@/app/(app)/class/_components/fetcher";
import { standard } from "@/db/schema";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";
import { and, desc, eq, gt, isNull, or, sql } from "drizzle-orm";

export async function getStandards(props: StandardSearchParamProps) {
  return Action.authenticate(async (auth) => {
    const res = await db
      .select({
        count: sql<number>`count(*) over()::int`,
        id: standard.id,
        title: standard.title,
        createdAt: standard.createdAt,
      })
      .from(standard)
      .where(
        and(
          isNull(standard.deletedAt),
          ...(props.q
            ? [or(gt(sql`SIMILARITY(${standard.title}, ${props.q})`, 0.2))]
            : [])
        )
      )
      .orderBy(
        props.q
          ? sql`
            GREATEST(
              SIMILARITY(${standard.title},${props.q})
            )
          `
          : desc(standard.createdAt)
      );

    return actionSuccess({
      records: res,
      count: res[0]?.count ?? 0,
    });
  }, true);
}
