import { deleteBatch } from "@/actions/batch/delete";
import { editBatch } from "@/actions/batch/edit";
import { getBatches } from "@/actions/batch/get";
import { createNewBatch } from "@/actions/batch/new";
import { Id } from "@/hooks/use-module-constructor";
import { TBatchSchema } from "@/schema/batch";
import { TBranchSchema } from "@/schema/branch";
import {
  createLoader,
  parseAsIndex,
  parseAsString,
  type inferParserType,
} from "nuqs/server";

export const batchSearchParams = {
  q: parseAsString.withDefault(""),
  page: parseAsIndex.withDefault(1),
  limit: parseAsIndex.withDefault(20),
};

export const loadBatchSearchParams = createLoader(batchSearchParams);

export type BatchSearchParamProps = inferParserType<typeof batchSearchParams>;

export const batchFetcher = {
  get: async (props: BatchSearchParamProps) => {
    return getBatches(props);
  },
  create: async (props: TBatchSchema) => {
    return createNewBatch(props);
  },
  update: async (id: Id, props: TBatchSchema) => {
    return editBatch(id, props);
  },

  delete: async (id: Id) => {
    return deleteBatch(id);
  },
};
