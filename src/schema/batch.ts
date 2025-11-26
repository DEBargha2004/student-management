import z from "zod";

export const batchSchema = z.object({
  title: z.string().min(1, "Title is required"),
  branch: z.coerce.number<any>().min(1, "Branch is required"),
  day: z.string().min(1, "Day is required"),
  timing: z.object({
    from: z.string().min(1, "From time is required"),
    to: z.string().min(1, "To time is required"),
  }),
});

export type TBatchSchema = z.infer<typeof batchSchema>;

export const defaultValues = (): TBatchSchema => ({
  title: "",
  branch: 0,
  day: "",
  timing: {
    from: "",
    to: "",
  },
});
