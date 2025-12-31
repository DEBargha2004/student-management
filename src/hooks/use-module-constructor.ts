"use client";

import { ActionResponse } from "@/lib/actions";
import { catchError, isActionError } from "@/lib/utils";
import { useEffect, useMemo, useRef, useState } from "react";

export type Id = string | number;
export type Item = { id: Id } & Record<string, any>;
export type DeleteResPayload = { message: string };

export type Get<T, Q> = {
  action: (
    config: Q
  ) => Promise<ActionResponse<{ records: T[]; count: number }>>;
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
  defaultValue?: { records: T[]; count: number };
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
  const [records, setRecords] = useState<T[]>(
    config.defaultValue?.records ?? []
  );
  const [loaders, setLoaders] = useState({
    isFetching: false,
    isDeleting: false,
  });
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [activeEdit, setActiveEdit] = useState<Id>("");
  const [totalRecords, setTotalRecords] = useState<number>(
    config.defaultValue?.count ?? 0
  );

  const queryKey = normalizeQuery(config.queryOps);

  const isFirstRender = useRef(true);
  const isEmpty = useMemo(() => {
    if (loaders.isFetching) return false;
    if (records.length) return false;
    return true;
  }, [loaders.isFetching, records]);

  const isEditing = (id: Id) => activeEdit === id;

  const onActiveEditChange = (id: Id) => {
    return (e: boolean) => {
      if (e) {
        const data = records.find((s) => s.id === id);
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
    setRecords((prev) =>
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
    setRecords((prev) => [...prev, res.data]);
    setTotalRecords((c) => c + 1);
    setPopoverOpen(false);
    return res.data;
  }

  async function deleteRecord(id: Id) {
    setLoaders((p) => ({ ...p, isDeleting: true }));
    const [err, res] = await catchError(config.delete.action(id));

    if (err) {
      return config.delete.onDeleteError?.(
        err.message ?? DEFAULT_ERROR_MESSAGE
      );
    }

    if (isActionError(res)) {
      return config.delete.onDeleteError?.(res.message);
    }

    setRecords((p) => p.filter((item) => item.id !== id));
    setTotalRecords((c) => c - 1);
    setLoaders((p) => ({ ...p, isDeleting: false }));
    config.delete.onDeleteSuccess?.(res.data);
  }

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    const controller = new AbortController();

    const fetchData = async () => {
      setLoaders((prev) => ({ ...prev, isFetching: true }));
      try {
        const res = await config.get.action(config.queryOps);
        if (controller.signal.aborted) return;

        if (isActionError(res)) {
          return config.get.onGetError?.(res.message);
        }
        setRecords(res.data.records);
        setTotalRecords(res.data.count);
      } catch (error) {
        config.get.onGetError?.((error as Error).message);
      } finally {
        if (!controller.signal.aborted)
          setLoaders((prev) => ({ ...prev, isFetching: false }));
      }
    };

    const timeout = setTimeout(fetchData, 600);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [queryKey]);

  useEffect(() => {
    return () => {
      isFirstRender.current = true;
    };
  }, []);

  return {
    create,
    data: records,
    update,
    deleteRecord,
    popoverOpen,
    setPopoverOpen,
    loaders,
    isEmpty,
    isEditing,
    onActiveEditChange,
    totalRecords,
    activeEdit,
  };
}
