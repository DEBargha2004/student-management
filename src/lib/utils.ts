import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ActionError, ActionResponse } from "./actions";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getBreadCrumbElements(pathname: string) {
  pathname = pathname.slice(1);
  const pathnameArr = pathname.split("/");

  const breadCrumbElements = pathnameArr.map((p, idx) => {
    const path = pathnameArr.slice(0, idx + 1).join("/");
    return {
      label: p.at(0)?.toUpperCase() + p.slice(1),
      href: `/${path}`,
    };
  });

  return breadCrumbElements;
}

export function isActionError<T>(res: ActionResponse<T>): res is ActionError {
  return res && res.success === false;
}

export async function catchError<T>(
  promise: Promise<T>
): Promise<[Error, undefined] | [undefined, T]> {
  try {
    return [undefined, await promise];
  } catch (error) {
    return [error as Error, undefined];
  }
}

export function deepClone<T>(o: T): T {
  if (typeof o !== "object" || o === null) return o;

  if (Array.isArray(o)) return o.map((e) => deepClone(e)) as T;

  const cloned = {} as Record<any, any>;
  for (const k in o) {
    cloned[k] = deepClone(o[k]);
  }

  return cloned as T;
}

export function actionError(message: string) {
  return {
    success: false as const,
    message,
  };
}

export function actionSuccess<T>(data: T) {
  return {
    success: true as const,
    data,
  };
}

export function formatTime(time: string) {
  const [h, m] = time.split(":");
  const meridiem = Number(h) >= 12 ? "pm" : "am";

  let hour = Number(h);
  hour = hour > 12 ? hour - 12 : hour;

  return `${hour}:${m} ${meridiem}`;
}
