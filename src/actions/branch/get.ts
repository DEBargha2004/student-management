"use server";

import { SearchParamProps } from "@/app/(app)/branch/_components/fetcher";
import { branch } from "@/db/schema";
import { Action } from "@/lib/actions";
import { db } from "@/lib/db";
import { actionSuccess } from "@/lib/utils";

export async function getBranches(q: SearchParamProps) {
  const res = await Action.authenticate(async (auth) => {
    const res = await db.select().from(branch);
    return actionSuccess(res);
  });

  return res;
}
