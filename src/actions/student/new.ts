"use server";

import { batch, branch, standard, student } from "@/db/schema";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";
import { studentSchema, TStudentSchema } from "@/schema/student";
import { and, eq, isNull } from "drizzle-orm";

export default async function createNewStudent(props: TStudentSchema) {
  return Action.authenticate(({ session, user }) => {
    return Action.use(studentSchema, props).next(async (props) => {
      const res = await db.transaction(async (trx) => {
        const _branch = await db
          .select()
          .from(branch)
          .where(
            and(isNull(branch.deletedAt), eq(branch.id, Number(props.branchId)))
          );

        if (!_branch.length) throw new Error("Invalid Branch");

        const _batch = await db
          .select()
          .from(batch)
          .where(
            and(
              isNull(batch.deletedAt),
              eq(batch.id, Number(props.batchId)),
              eq(batch.branchId, Number(props.branchId))
            )
          );

        if (!_batch.length) throw new Error("Invalid Batch");

        const _standard = await db
          .select()
          .from(standard)
          .where(
            and(
              isNull(standard.deletedAt),
              eq(standard.id, Number(props.standardId))
            )
          );

        if (!_standard.length) throw new Error("Invalid Standard");

        const _student = await db
          .insert(student)
          .values({
            name: props.name,
            guardian: props.guardian,
            address: props.address,
            branchId: Number(props.branchId),
            batchId: Number(props.batchId),
            standardId: Number(props.standardId),
            phone: props.phone,
          })
          .returning();

        return {
          _student: _student[0],
          _batch: _batch[0],
          _branch: _branch[0],
          _standard: _standard[0],
        };
      });

      return actionSuccess({
        id: res._student.id,
        name: res._student.name,
        guardian: res._student.guardian,
        address: res._student.address,
        phone: res._student.phone,
        branch: {
          id: res._branch.id,
          title: res._branch.title,
        },
        batch: {
          id: res._batch.id,
          title: res._batch.title,
        },
        standard: {
          id: res._standard.id,
          title: res._standard.title,
        },
      });
    });
  });
}
