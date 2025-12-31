"use server";

import { student } from "@/db/schema";
import { Id } from "@/hooks/use-module-constructor";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";
import { eq } from "drizzle-orm";

export async function deleteStudent(id: Id) {
  return Action.authenticate(async ({ session, user }) => {
    await db
      .update(student)
      .set({
        deletedAt: new Date(),
      })
      .where(eq(student.id, Number(id)));

    return actionSuccess({ message: "Student Deleted Successfully" });
  });
}
