import z from "zod";

export const standardSchema = z.object({
  title: z.string().min(3),
});

export type TStandardSchema = z.infer<typeof standardSchema>;
export const defaultValues = (): TStandardSchema => ({
  title: "",
});
