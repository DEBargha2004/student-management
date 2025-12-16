import z from "zod";

export const studentSchema = z.object({
  name: z.string().min(3, { error: "Name must be at least 3 characters" }),
  gaurdian: z
    .string()
    .min(3, { error: "Gaurdian name must be at least 3 characters" }),
  phone: z.string().refine((v) => v.length === 10, {
    error: "Phone number must be 10 digits",
  }),
  address: z.string().optional(),
  standardId: z
    .string()
    .min(1)
    .refine((v) => !isNaN(Number(v)), { error: "Standard is required" }),
  branchId: z
    .string()
    .min(1)
    .refine((v) => !isNaN(Number(v)), { error: "Branch is required" }),
  batchId: z
    .string()
    .min(1)
    .refine((v) => !isNaN(Number(v)), { error: "Batch is required" }),
});

export type TStudentSchema = z.infer<typeof studentSchema>;
export const defaultValues = (): TStudentSchema => ({
  name: "",
  gaurdian: "",
  phone: "",
  address: "",
  standardId: "",
  branchId: "",
  batchId: "",
});
