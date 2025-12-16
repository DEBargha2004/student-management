import { deleteStandard } from "@/actions/standard/delete";
import { editStandard } from "@/actions/standard/edit";
import { getStandards } from "@/actions/standard/get";
import { createNewStandard } from "@/actions/standard/new";
import { Id } from "@/hooks/use-module-constructor";
import { TStandardSchema } from "@/schema/standard";
import {
  createLoader,
  parseAsIndex,
  parseAsString,
  type inferParserType,
} from "nuqs/server";

export const standardSearchParams = {
  q: parseAsString.withDefault(""),
  page: parseAsIndex.withDefault(1),
  limit: parseAsIndex.withDefault(20),
};

export const loadBatchSearchParams = createLoader(standardSearchParams);

export type StandardSearchParamProps = inferParserType<
  typeof standardSearchParams
>;

export const standardFetcher = {
  get: async (props: StandardSearchParamProps) => {
    return getStandards(props);
  },
  create: async (props: TStandardSchema) => {
    return createNewStandard(props);
  },
  update: async (id: Id, props: TStandardSchema) => {
    return editStandard(id, props);
  },

  delete: async (id: Id) => {
    return deleteStandard(id);
  },
};
