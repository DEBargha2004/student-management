import { headers } from "next/headers";
import { auth } from "./auth";
import { Session, User } from "better-auth";
import { actionError, catchError } from "./utils";
import z from "zod";

type TErrorCode = "no-user";

export type ActionError = {
  success: false;
  message: string;
};

export type ActionSuccess<T> = {
  success: true;
  data: T;
};

export type ActionResponse<T> = ActionError | ActionSuccess<T>;

export class Action {
  static async authenticate<T>(
    op: (props: { session: Session; user: User }) => Promise<T | ActionError>
  ): Promise<ActionError | T> {
    const authInfo = await auth.api.getSession({ headers: await headers() });

    if (!authInfo?.user) return actionError(errorCode["no-user"]);

    return op(authInfo);
  }

  static use<T extends z.ZodType>(validator: T, req: any) {
    const { success, data } = validator.safeParse(req);

    return {
      next: async <R>(
        recipe: (props: z.infer<T>) => Promise<R | ActionError>
      ): Promise<ActionError | R> => {
        if (!success) return actionError("Invalid Data");

        const [err, res] = await catchError(recipe(data as z.infer<T>));

        if (err) return actionError(err.message);

        return res;
      },
    };
  }
}

const errorCode = {
  "no-user": "Unauthenticated user. Please login again",
} as const satisfies Record<TErrorCode, string>;
