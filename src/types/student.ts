import { Id } from "@/hooks/use-module-constructor";

export type StudentRecord = {
  id: Id;
  name: string;
  guardianName?: string;
  contactNumber?: string;
  address?: string;
};
