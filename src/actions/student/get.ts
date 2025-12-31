"use server";

import { StudentSearchParamProps } from "@/app/(app)/student/_components/fetcher";
import { batch, branch, standard, student } from "@/db/schema";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";
import { and, desc, eq, gt, isNull, or, sql } from "drizzle-orm";

type FKRecord = {
  id: number;
  title: string;
};

export default async function getStudents(props: StudentSearchParamProps) {
  return Action.authenticate(async ({ session, user }) => {
    const res = await db
      .select({
        id: student.id,
        name: student.name,
        guardian: student.guardian,
        address: student.address,
        count: sql<number>`COUNT(*) OVER()::INT`,
        branch: sql<FKRecord>`JSON_BUILD_OBJECT(
                    'id', ${branch.id},
                    'title', ${branch.title}
                )`,
        batch: sql<FKRecord>`JSON_BUILD_OBJECT(
                    'id', ${batch.id},
                    'title', ${batch.title}
                )`,
        standard: sql<FKRecord>`JSON_BUILD_OBJECT(
                    'id', ${standard.id},
                    'title', ${standard.title}
                )`,
        phone: student.phone,
      })
      .from(student)
      .where(
        and(
          isNull(student.deletedAt),
          ...(props.q
            ? [
                or(
                  gt(sql`SIMILARITY(${student.name},${props.q})`, 0.2),
                  gt(sql`SIMILARITY(${standard.title},${props.q})`, 0.2),
                  gt(sql`SIMILARITY(${batch.title},${props.q})`, 0.2),
                  gt(sql`SIMILARITY(${branch.title},${props.q})`, 0.2)
                ),
              ]
            : [])
        )
      )
      .leftJoin(branch, eq(student.branchId, branch.id))
      .leftJoin(batch, eq(student.batchId, batch.id))
      .leftJoin(standard, eq(student.standardId, standard.id))
      .groupBy(student.id, branch.id, batch.id, standard.id)
      .orderBy(
        ...(props.q
          ? [
              desc(
                sql`
                  GREATEST(
                    SIMILARITY(${student.name},${props.q}),
                    SIMILARITY(${standard.title},${props.q}),
                    SIMILARITY(${batch.title},${props.q}),
                    SIMILARITY(${branch.title},${props.q})
                  )
                `
              ),
            ]
          : [])
      )
      .limit(props.limit)
      .offset((props.page - 1) * props.limit);

    return actionSuccess({
      records: res,
      count: res[0]?.count ?? 0,
    });
  });
}

export async function getDefaultsForStudentFormUpdate(props: {
  branchId: string;
  batchId: string;
  standardId: string;
}) {
  return Action.authenticate(async ({ session, user }) => {
    const res = await db.transaction(async (trx) => {
      const _branch = await db
        .select()
        .from(branch)
        .where(eq(branch.id, Number(props.branchId)));

      const _batch = await db
        .select({
          id: batch.id,
          title: batch.title,
          branch: {
            id: branch.id,
            title: branch.title,
          },
          timing: batch.timing,
          day: batch.day,
        })
        .from(batch)
        .leftJoin(branch, eq(batch.branchId, branch.id))
        .where(eq(batch.id, Number(props.batchId)));

      const _standard = await db
        .select()
        .from(standard)
        .where(eq(standard.id, Number(props.standardId)));

      return {
        branch: _branch[0],
        batch: _batch[0],
        standard: _standard[0],
      };
    });
    return actionSuccess(res);
  });
}
