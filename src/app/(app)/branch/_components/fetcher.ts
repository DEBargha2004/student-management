import { getBranches } from "@/actions/branch/get";
import { createNewBranch } from "@/actions/branch/new";
import { TDBBranch } from "@/db/schema";
import { Id } from "@/hooks/use-module-constructor";
import { actionSuccess } from "@/lib/utils";
import { TBranchSchema } from "@/schema/branch";
import { createLoader, parseAsString } from "nuqs/server";

export type SearchParamProps = {
  q?: string;
  last?: string;
};

export const branchSearchParams = {
  q: parseAsString.withDefault(""),
  last: parseAsString.withDefault(""),
};

export const loadBranchSearchParams = createLoader(branchSearchParams);

export const branchFetcher = {
  get: async (props: SearchParamProps) => {
    return getBranches(props);
  },
  create: async (props: TBranchSchema) => {
    return createNewBranch(props);
  },
  update: async (id: Id, props: TBranchSchema) => {
    return actionSuccess({} as TDBBranch);
  },

  delete: async (id: Id) => {
    return actionSuccess(undefined);
  },
};
