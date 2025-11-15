"use client";

import { ActionResponse } from "@/lib/actions";
import { catchError, isActionError } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

export type Id = string | number;
export type Item = { id: Id } & Record<string, any>;
export type DeleteResPayload = { message: string };

export type Get<T, Q> = {
  action: (config: Q) => Promise<ActionResponse<T[]>>;
  onGetError?: (message: string) => void;
};
export type Create<T, U> = {
  action: (props: U) => Promise<ActionResponse<T>>;
  onCreateSuccess?: (data: T) => void;
  onCreateError?: (message: string) => void;
};
export type Update<T, U> = {
  action: (id: Id, props: U) => Promise<ActionResponse<T>>;
  onUpdateSuccess?: (data: T) => void;
  onUpdateError?: (message: string) => void;
};
export type Delete = {
  action: (id: Id) => Promise<ActionResponse<DeleteResPayload>>;
  onDeleteSuccess?: (data: DeleteResPayload) => void;
  onDeleteError?: (message: string) => void;
};

export type TModuleConstructor<T, U, Q> = {
  queryOps: Q;
  create: Create<T, U>;
  get: Get<T, Q>;
  update: Update<T, U>;
  delete: Delete;
  editing: {
    onEditStart: (data: T) => void;
    onEditEnd: () => void;
  };
  defaultValue?: T[];
};

function normalizeQuery(queryOps: Record<string, any>) {
  const sortedKeys = Object.keys(queryOps).sort((a, b) => a.localeCompare(b));
  return sortedKeys.map((k) => `${k}=${JSON.stringify(queryOps[k])}`).join("&");
}

const DEFAULT_ERROR_MESSAGE = "Something went wrong";

export function useModuleConstructor<
  T extends Item,
  U extends Record<string, any>,
  Q extends Record<string, any>
>(config: TModuleConstructor<T, U, Q>) {
  const [_localState, _setLocalState] = useState<T[]>(
    config.defaultValue ?? []
  );
  const [isFetching, setIsFetching] = useState(false);
  const queryKey = normalizeQuery(config.queryOps);
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [activeEdit, setActiveEdit] = useState<Id>("");

  const isFirstRender = useRef(true);
  const isEmpty = useMemo(() => {
    if (isFetching) return false;
    if (_localState.length) return false;
    return true;
  }, [isFetching, _localState]);

  const isEditing = (id: Id) => activeEdit === id;

  const onActiveEditChange = (id: Id) => {
    return (e: boolean) => {
      if (e) {
        const data = _localState.find((s) => s.id === id);
        if (data) {
          config.editing.onEditStart(data);
          setActiveEdit(id);
        }
      } else {
        config.editing.onEditEnd();
        setActiveEdit("");
      }
    };
  };

  async function update(id: Id, props: U) {
    const [err, res] = await catchError(config.update.action(id, props));
    if (err) {
      return config.update.onUpdateError?.(
        err.message ?? DEFAULT_ERROR_MESSAGE
      );
    }

    if (isActionError(res)) {
      return config.update.onUpdateError?.(res.message);
    }

    config.update.onUpdateSuccess?.(res.data);
    _setLocalState((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...res.data } : item))
    );
    onActiveEditChange(id)(false);
    return res.data;
  }

  async function create(data: U) {
    const [err, res] = await catchError(config.create.action(data));

    if (err) {
      return config.create.onCreateError?.(
        err.message ?? DEFAULT_ERROR_MESSAGE
      );
    }

    if (isActionError(res)) {
      return config.create.onCreateError?.(res.message);
    }

    config.create.onCreateSuccess?.(res.data);
    _setLocalState((prev) => [...prev, res.data]);
    setPopoverOpen(false);
    return res.data;
  }

  async function deleteRecord(id: Id) {
    const [err, res] = await catchError(config.delete.action(id));

    if (err) {
      return config.delete.onDeleteError?.(
        err.message ?? DEFAULT_ERROR_MESSAGE
      );
    }

    if (isActionError(res)) {
      return config.delete.onDeleteError?.(res.message);
    }

    _setLocalState((p) => p.filter((item) => item.id !== id));
    config.delete.onDeleteSuccess?.(res.data);
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setIsFetching(true);
      try {
        const res = await config.get.action(config.queryOps);
        if (controller.signal.aborted) return;

        if (isActionError(res)) {
          return config.get.onGetError?.(res.message);
        }
        _setLocalState(res.data);
      } catch (error) {
        config.get.onGetError?.((error as Error).message);
      } finally {
        if (!controller.signal.aborted) setIsFetching(false);
      }
    };

    const timeout = setTimeout(fetchData, 600);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [queryKey]);

  return {
    create,
    data: _localState,
    update,
    deleteRecord,
    popoverOpen,
    setPopoverOpen,
    isFetching,
    isEmpty,
    isEditing,
    onActiveEditChange,
  };
}
