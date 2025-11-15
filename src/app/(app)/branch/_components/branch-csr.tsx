"use client";

import BreadCrumbConstructor from "@/components/custom/bread-crumb-constructor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { TDBBranch } from "@/db/schema";
import { useModuleConstructor } from "@/hooks/use-module-constructor";
import { branchSchema, defaultValues, TBranchSchema } from "@/schema/branch";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EllipsisVerticalIcon,
  PencilIcon,
  PlusIcon,
  SlidersHorizontalIcon,
  Trash2Icon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { branchFetcher, branchSearchParams, SearchParamProps } from "./fetcher";
import BranchForm from "@/components/custom/forms/branch";
import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  MultiDialog,
  MultiDialogContent,
  MultiDialogTrigger,
} from "@/components/custom/multi-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useQueryStates } from "nuqs";
import { Input } from "@/components/ui/input";
import PaginationBuilder from "@/components/custom/pagination";
import { Skeleton } from "@/components/ui/skeleton";

export default function BranchCSR({
  defaultValue,
}: {
  defaultValue?: TDBBranch[];
}) {
  const pathname = usePathname();
  const form = useForm<TBranchSchema>({
    resolver: zodResolver(branchSchema),
    defaultValues: defaultValues(),
  });
  const [queryProps, setQueryProps] = useQueryStates(branchSearchParams, {
    history: "push",
  });

  const mc = useModuleConstructor<TDBBranch, TBranchSchema, SearchParamProps>({
    queryOps: queryProps,
    get: {
      action: branchFetcher.get,
      onGetError(message) {},
    },
    create: {
      action: branchFetcher.create,
      onCreateSuccess(data) {},
      onCreateError(data) {},
    },
    update: {
      action: branchFetcher.update,
      onUpdateSuccess(data) {},
      onUpdateError(data) {},
    },
    delete: {
      action: branchFetcher.delete,
      onDeleteSuccess(data) {},
      onDeleteError(data) {},
    },
    editing: {
      onEditStart(data) {
        form.reset({
          title: data.title,
          address: data.address ?? "",
        });
      },
      onEditEnd() {
        form.reset(defaultValues());
      },
    },
    defaultValue,
  });

  useEffect(() => {
    if (!mc.popoverOpen) form.reset();
  }, [mc.popoverOpen]);

  return (
    <div className="space-y-6">
      <section className="flex justify-between items-center">
        <BreadCrumbConstructor pathname={pathname} />
        <Dialog open={mc.popoverOpen} onOpenChange={mc.setPopoverOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusIcon />
              <span>New Branch</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="hidden" />
            </DialogHeader>
            <BranchForm form={form} onSubmit={mc.create} />
          </DialogContent>
        </Dialog>
      </section>
      <section className="flex gap-5">
        <Input
          className="flex-1"
          value={queryProps.q}
          onChange={(e) =>
            setQueryProps((prev) => ({ ...prev, q: e.target.value }))
          }
        />
        <Button variant={"secondary"}>
          <SlidersHorizontalIcon />
          <span>Filter</span>
        </Button>
      </section>
      <section>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mc.isFetching &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={4}>
                        <Skeleton className="w-full h-10 rounded" />
                      </TableCell>
                    </TableRow>
                  ))}
                {mc.isEmpty && (
                  <TableRow>
                    <TableCell colSpan={4} className="">
                      <p className="flex justify-center py-5 text-muted-foreground italic">
                        No Data Found
                      </p>
                    </TableCell>
                  </TableRow>
                )}
                {!mc.isFetching &&
                  mc.data.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>{b.id}</TableCell>
                      <TableCell>{b.title}</TableCell>
                      <TableCell>{b.address}</TableCell>
                      <TableCell>
                        <MultiDialog>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant={"secondary"}
                                size={"icon"}
                                className="rounded-full"
                              >
                                <EllipsisVerticalIcon />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="start">
                              <MultiDialogTrigger locator="edit" asChild>
                                <DropdownMenuItem>
                                  <PencilIcon /> <span>Edit</span>
                                </DropdownMenuItem>
                              </MultiDialogTrigger>
                              <MultiDialogTrigger locator="delete" asChild>
                                <DropdownMenuItem variant="destructive">
                                  <Trash2Icon /> <span>Delete</span>
                                </DropdownMenuItem>
                              </MultiDialogTrigger>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          <MultiDialogContent
                            id="edit"
                            open={mc.isEditing(b.id)}
                            onOpenChange={mc.onActiveEditChange(b.id)}
                          >
                            <DialogHeader>
                              <DialogTitle>Edit</DialogTitle>
                            </DialogHeader>
                            <BranchForm
                              form={form}
                              onSubmit={(data) => mc.update(b.id, data)}
                            />
                          </MultiDialogContent>
                          <MultiDialogContent id="delete">
                            <DialogHeader>
                              <DialogTitle>Delete</DialogTitle>
                            </DialogHeader>
                          </MultiDialogContent>
                        </MultiDialog>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
      <section>
        <Card>
          <CardFooter className="ml-auto">
            <PaginationBuilder />
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
