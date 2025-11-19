import { deleteBranch } from "@/actions/branch/delete";
import { editBranch } from "@/actions/branch/edit";
import { getBranches } from "@/actions/branch/get";
import { createNewBranch } from "@/actions/branch/new";
import { TDBBranch } from "@/db/schema";
import { Id } from "@/hooks/use-module-constructor";
import { actionSuccess } from "@/lib/utils";
import { TBranchSchema } from "@/schema/branch";
import {
  createLoader,
  parseAsIndex,
  parseAsString,
  type inferParserType,
} from "nuqs/server";

export const branchSearchParams = {
  q: parseAsString.withDefault(""),
  page: parseAsIndex.withDefault(1),
  limit: parseAsIndex.withDefault(20),
};

export const loadBranchSearchParams = createLoader(branchSearchParams);

export type BranchSearchParamProps = inferParserType<typeof branchSearchParams>;

export const branchFetcher = {
  get: async (props: BranchSearchParamProps) => {
    return getBranches(props);
  },
  create: async (props: TBranchSchema) => {
    return createNewBranch(props);
  },
  update: async (id: Id, props: TBranchSchema) => {
    return editBranch(id, props);
  },

  delete: async (id: Id) => {
    return deleteBranch(id);
  },
};
