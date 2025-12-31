import { deleteStudent } from "@/actions/student/delete";
import editStudent from "@/actions/student/edit";
import getStudents from "@/actions/student/get";
import createNewStudent from "@/actions/student/new";
import { Id } from "@/hooks/use-module-constructor";
import { TStudentSchema } from "@/schema/student";
import {
  createLoader,
  parseAsIndex,
  parseAsString,
  type inferParserType,
} from "nuqs/server";

export const studentSearchParams = {
  q: parseAsString.withDefault(""),
  page: parseAsIndex.withDefault(1),
  limit: parseAsIndex.withDefault(20),
};

export const loadStudentSearchParams = createLoader(studentSearchParams);

export type StudentSearchParamProps = inferParserType<
  typeof studentSearchParams
>;

export const studentFetcher = {
  get: async (props: StudentSearchParamProps) => {
    return getStudents(props);
  },
  create: async (props: TStudentSchema) => {
    return createNewStudent(props);
  },
  update: async (id: Id, props: TStudentSchema) => {
    return editStudent(id, props);
  },

  delete: async (id: Id) => {
    return deleteStudent(id);
  },
};
