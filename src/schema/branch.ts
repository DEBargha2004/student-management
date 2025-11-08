import z from "zod";

export const branchSchema = z.object({
  title: z.string().min(3),
  address: z.string().optional(),
});

export type TBranchSchema = z.infer<typeof branchSchema>;

export const defaultValues = (): TBranchSchema => ({
  title: "",
  address: "",
});
