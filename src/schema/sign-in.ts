import { z } from "zod";

export const signInSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export type TSignInSchema = z.infer<typeof signInSchema>;
export const defaultValues = (): TSignInSchema => ({
  email: "",
  password: "",
});
