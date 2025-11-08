"use client";

import { defaultValues, signInSchema, TSignInSchema } from "@/schema/sign-in";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import SignInForm from "@/components/custom/forms/sign-in";
import Link from "next/link";
import { signIn } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Page() {
  const form = useForm<TSignInSchema>({
    defaultValues: defaultValues(),
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: TSignInSchema) => {
    await signIn.email(
      {
        email: data.email,
        password: data.password,
        callbackURL: "/",
      },
      {
        onSuccess(context) {
          toast.success("Sign In Successful");
        },
        onError(context) {
          toast.error(context.error.message ?? context.error.statusText);
        },
      }
    );
  };

  return (
    <Card className="min-w-lg">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent>
        <SignInForm form={form} onSubmit={onSubmit} />
      </CardContent>
      <CardFooter>
        <p className="mx-auto text-sm">
          Create New Account.&nbsp;
          <u className="text-primary">
            <Link href={"/auth/sign-up"}>Sign Up</Link>
          </u>
        </p>
      </CardFooter>
    </Card>
  );
}
