"use server";

import { batch, branch, standard, student } from "@/db/schema";
import { Id } from "@/hooks/use-module-constructor";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";
import { studentSchema, TStudentSchema } from "@/schema/student";
import { StudentRecord } from "@/types/student";
import { and, eq, isNull } from "drizzle-orm";

export default async function editStudent(id: Id, payload: TStudentSchema) {
  return Action.authenticate(({ session, user }) => {
    return Action.use(studentSchema, payload).next(async (payload) => {
      const res = await db.transaction(async (trx) => {
        const _branch = await trx
          .select()
          .from(branch)
          .where(
            and(
              isNull(branch.deletedAt),
              eq(branch.id, Number(payload.branchId))
            )
          );

        if (!_branch.length) throw new Error("Invalid Branch");

        const _batch = await trx
          .select()
          .from(batch)
          .where(
            and(
              isNull(batch.deletedAt),
              eq(batch.id, Number(payload.batchId)),
              eq(batch.branchId, Number(payload.branchId))
            )
          );

        if (!_batch.length) throw new Error("Invalid Batch");

        const _standard = await trx
          .select()
          .from(standard)
          .where(
            and(
              isNull(standard.deletedAt),
              eq(standard.id, Number(payload.standardId))
            )
          );

        if (!_standard.length) throw new Error("Invalid Standard");

        const _student = await trx
          .update(student)
          .set({
            name: payload.name,
            guardian: payload.guardian,
            phone: payload.phone,
            address: payload.address,
            standardId: Number(payload.standardId),
            branchId: Number(payload.branchId),
            batchId: Number(payload.batchId),
            updatedAt: new Date(),
          })
          .where(eq(student.id, Number(id)))
          .returning();

        return {
          _branch: _branch[0],
          _batch: _batch[0],
          _standard: _standard[0],
          _student: _student[0],
        };
      });

      return actionSuccess({
        id: res._student.id,
        name: res._student.name,
        phone: res._student.phone,
        guardian: res._student.guardian,
        address: res._student.address,
        batch: {
          id: res._batch.id,
          title: res._batch.title,
        },
        branch: {
          id: res._branch.id,
          title: res._branch.title,
        },
        standard: {
          id: res._standard.id,
          title: res._standard.title,
        },
      } as StudentRecord);
    });
  });
}
