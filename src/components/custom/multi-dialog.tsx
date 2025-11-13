"use client";

import { deepClone } from "@/lib/utils";
import React, {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Slot } from "@radix-ui/react-slot";
import { Dialog, DialogContent } from "../ui/dialog";

type TMultiDialog = {
  open: Record<string, boolean>;
  setOpen: Dispatch<SetStateAction<TMultiDialog["open"]>>;
};

const MultiDialogContext = createContext<TMultiDialog | null>(null);

export function MultiDialog({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState<Record<string, boolean>>({});
  return (
    <MultiDialogContext.Provider value={{ open, setOpen }}>
      {children}
    </MultiDialogContext.Provider>
  );
}

export function MultiDialogTrigger({
  locator,
  asChild,
  className,
  ...props
}: React.ComponentProps<"button"> & {
  locator: string;
  asChild?: boolean;
}) {
  const { register, setOpen } = useMultiDialog(locator);

  useEffect(() => {
    register();
  }, [locator]);

  const Comp = asChild ? Slot : "button";
  return (
    <Comp
      {...props}
      onClick={(...e) => {
        setOpen((p) => !p);
        props.onClick?.(...e);
      }}
    />
  );
}

export function MultiDialogContent({
  children,
  id,
}: {
  children: React.ReactNode;
  id: string;
}) {
  const { open, setOpen } = useMultiDialog(id);

  return (
    <Dialog open={open} onOpenChange={(e) => setOpen(() => e)}>
      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
}

export function useMultiDialog(locator: string) {
  const context = useContext(MultiDialogContext);

  if (!context)
    throw new Error("useMultiDialog should be used within MultiDialogContext");

  const open = context.open[locator];
  const setOpen = (fn: (state: boolean) => boolean) => {
    context.setOpen((p) => {
      const clone = deepClone(p);
      const state = fn(clone[locator]);
      clone[locator] = state;
      return clone;
    });
  };
  const register = () => {
    context.setOpen((p) => {
      const clone = deepClone(p);
      clone[locator] = false;
      return clone;
    });
  };

  const deregister = () => {
    context.setOpen((p) => {
      const clone = deepClone(p);
      delete clone[locator];
      return clone;
    });
  };

  return { open, setOpen, register, deregister };
}
