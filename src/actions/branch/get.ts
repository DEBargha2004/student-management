"use server";

import { SearchParamProps } from "@/app/(app)/branch/_components/fetcher";
import { branch } from "@/db/schema";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";
import { desc } from "drizzle-orm";

export async function getBranches(q: SearchParamProps) {
  const res = await Action.authenticate(async (auth) => {
    const res = await db.select().from(branch).orderBy(desc(branch.createdAt));
    return actionSuccess(res);
  }, true);

  return res;
}
