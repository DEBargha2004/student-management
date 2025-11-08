import z from "zod";

export const signUpSchema = z
  .object({
    name: z.string().min(3),
    email: z.email(),
    password: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (password !== confirmPassword)
      ctx.addIssue({
        code: "custom",
        message: "Passwords don't match",
        path: ["confirmPassword"],
      });
  });

export type TSignUpSchema = z.infer<typeof signUpSchema>;
export const defaultValues = (): TSignUpSchema => ({
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
});
