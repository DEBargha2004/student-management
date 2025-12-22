import { Id } from "@/hooks/use-module-constructor";

export type StudentRecord = {
  id: Id;
  name: string;
  guardian: string;
  phone: string;
  address: string;
  branch: {
    id: Id;
    title: string;
  };
  batch: {
    id: Id;
    title: string;
  };
  standard: {
    id: Id;
    title: string;
  };
};
