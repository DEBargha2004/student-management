"use client";

import { ActionResponse } from "@/lib/actions";
import { catchError, deepClone, isActionError } from "@/lib/utils";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export type Id = string | number;
export type Item = { id: Id } & Record<string, any>;

export type Create<T, U> = (props: U) => Promise<ActionResponse<T>>;
export type Get<T, Q> = (params: Q) => Promise<ActionResponse<T[]>>;
export type Update<T, U> = (id: Id, props: U) => Promise<ActionResponse<T>>;
export type Delete = (id: Id) => Promise<ActionResponse<undefined>>;

export type TModuleConstructor<T, U, Q> = {
  queryOps: Q;
  create: Create<T, U>;
  get: Get<T, Q>;
  update: Update<T, U>;
  delete: Delete;
};

function normalizeQuery(queryOps: Record<string, any>) {
  let key = "";
  for (let k in queryOps) {
    key += `${k}=${queryOps[k]}.`;
  }
  return key;
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong";

export function useModuleConstructor<
  T extends Item,
  U extends Record<string, any>,
  Q extends Record<string, any>
>(params: TModuleConstructor<T, U, Q>, defaultValue?: T[]) {
  const [_localState, _setLocalState] = useState<T[]>(defaultValue ?? []);
  const queryKey = normalizeQuery(params.queryOps);
  const [popoverOpen, setPopoverOpen] = useState(false);

  async function update(id: Id, props: U) {
    const [err, res] = await catchError(params.update(id, props));
    if (err) {
      return toast.error(err.message ?? DEFAULT_ERROR_MESSAGE);
    }

    if (isActionError(res)) {
      return toast.error(res.message);
    }

    toast.success("Data updated successfully");
    _setLocalState((prev) => {
      const cloned = deepClone(prev);
      const item = cloned.find((i) => i.id === id);

      if (item) {
        Object.assign(item, res.data);
      }

      return cloned;
    });
    return res.data;
  }

  async function create(data: U) {
    console.log(data);
    const [err, res] = await catchError(params.create(data));

    if (err) {
      return toast.error(err.message ?? DEFAULT_ERROR_MESSAGE);
    }

    if (isActionError(res)) {
      return toast.error(res.message);
    }

    toast.success("New data created successfully");
    _setLocalState((prev) => {
      const cloned = deepClone(prev);
      cloned.push(res.data);
      return cloned;
    });
    setPopoverOpen(false);
    return res.data;
  }

  async function deleteRecord(id: Id) {
    const [err, res] = await catchError(params.delete(id));

    if (err) {
      return toast.error(err.message ?? DEFAULT_ERROR_MESSAGE);
    }

    if (isActionError(res)) {
      return toast.error("Data could not be deleted");
    }

    toast.success("Data deleted successfully");
  }

  useEffect(() => {
    const controller = new AbortController();

    setTimeout(() => {
      if (!controller.signal.aborted) {
        params
          .get(params.queryOps)
          ?.then((r) => {
            if (isActionError(r)) {
              return toast.error(r.message ?? "Could not fetch");
            }

            _setLocalState(r.data);
          })
          .catch((e) => {
            console.log(e);
            toast.error("Could not fetch");
          });
      }
    }, 600);

    return () => controller.abort();
  }, [queryKey]);

  return {
    create,
    data: _localState,
    update,
    deleteRecord,
    popoverOpen,
    setPopoverOpen,
  };
}
