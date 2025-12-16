"use client";

import BreadCrumbConstructor from "@/components/custom/bread-crumb-constructor";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useModuleConstructor } from "@/hooks/use-module-constructor";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  EllipsisVerticalIcon,
  Loader2,
  PencilIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import {
  standardFetcher,
  StandardSearchParamProps,
  standardSearchParams,
} from "./fetcher";
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
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { catchError, formatTime, isActionError } from "@/lib/utils";
import { getDay } from "@/constants/days";
import { StandardRecord } from "@/types/standard";
import StandardForm from "@/components/custom/forms/form";
import { defaultValues, studentSchema, TStudentSchema } from "@/schema/student";
import { StudentRecord } from "@/types/student";
import StudentForm from "@/components/custom/forms/student";

export default function StandardCSR({
  defaultValue,
}: {
  defaultValue?: { records: StandardRecord[]; count: number };
}) {
  const pathname = usePathname();
  const form = useForm<TStudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues: defaultValues(),
  });
  const [queryProps, setQueryProps] = useQueryStates(standardSearchParams, {
    history: "push",
  });
  const [chanllengeInputString, setChallengeInputString] = useState("");

  const mc = useModuleConstructor<
    StudentRecord,
    TStudentSchema,
    StandardSearchParamProps
  >({
    queryOps: queryProps,
    get: {
      action: standardFetcher.get,
      onGetError(message) {
        toast.error(message);
      },
    },
    create: {
      action: standardFetcher.create,
      onCreateSuccess(data) {
        toast.success(`${data.title} created successfully`);
      },
      onCreateError(data) {
        toast.error(data);
      },
    },
    update: {
      action: standardFetcher.update,
      onUpdateSuccess(data) {
        toast.success(`${data.title} Updated Successfully`);
      },
      onUpdateError(data) {
        toast.error(data);
      },
    },
    delete: {
      action: standardFetcher.delete,
      onDeleteSuccess(data) {
        toast.success(data.message);
      },
      onDeleteError(data) {
        toast.error(data);
      },
    },
    editing: {
      onEditStart(data) {
        form.reset({
          title: data.title,
        });
      },
      onEditEnd() {
        form.reset(defaultValues());
      },
    },
    defaultValue,
  });

  const handleNavigate = (page: number) => {
    setQueryProps((props) => ({ ...props, page }));
  };

  useEffect(() => {
    setChallengeInputString("");
  }, [mc.data.length]);

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
              <span>New Student</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="hidden" />
            </DialogHeader>
            <StudentForm form={form} onSubmit={mc.create} />
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
      </section>
      <section>
        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Id</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mc.loaders.isFetching &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={3}>
                        <Skeleton className="w-full h-10 rounded" />
                      </TableCell>
                    </TableRow>
                  ))}
                {mc.isEmpty && (
                  <TableRow>
                    <TableCell colSpan={3} className="">
                      <p className="flex justify-center py-5 text-muted-foreground italic">
                        No Data Found
                      </p>
                    </TableCell>
                  </TableRow>
                )}
                {!mc.loaders.isFetching &&
                  mc.data.map((b) => (
                    <TableRow key={b.id}>
                      <TableCell>{b.id}</TableCell>
                      <TableCell>{b.title}</TableCell>
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
                            <StudentForm
                              form={form}
                              onSubmit={(data) => mc.update(b.id, data)}
                            />
                          </MultiDialogContent>
                          <MultiDialogContent id="delete">
                            <DialogHeader>
                              <DialogTitle>Delete</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                              Are you sure want to delete{" "}
                              <code className="important">{b.title}</code>
                              &nbsp;situated at{" "}
                              {/* <code className="important">{b.address}</code> */}
                            </DialogDescription>
                            <div className="space-y-3 mt-3">
                              <Label className="text-muted-foreground">
                                Type{" "}
                                <span className="important">{b.title}</span> to
                                continue
                              </Label>
                              <Input
                                placeholder={b.title}
                                className="placeholder:italic"
                                value={chanllengeInputString}
                                onChange={(e) =>
                                  setChallengeInputString(e.target.value)
                                }
                              />
                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button variant={"secondary"}>Close</Button>
                                </DialogClose>
                                <Button
                                  variant={"destructive"}
                                  disabled={
                                    mc.loaders.isDeleting ||
                                    b.title !== chanllengeInputString
                                  }
                                  onClick={() => mc.deleteRecord(b.id)}
                                >
                                  {mc.loaders.isDeleting ? (
                                    <Loader2 className="animate-spin" />
                                  ) : (
                                    "Delete"
                                  )}
                                </Button>
                              </DialogFooter>
                            </div>
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
          <CardFooter className="m-0">
            <PaginationBuilder
              perPage={queryProps.limit}
              currentPage={queryProps.page}
              totalRecords={mc.totalRecords}
              neighbourCount={1}
              navigateTo={handleNavigate}
            />
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
