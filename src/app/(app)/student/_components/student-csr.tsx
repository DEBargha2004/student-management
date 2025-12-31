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
  studentFetcher,
  StudentSearchParamProps,
  studentSearchParams,
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
import { defaultValues, studentSchema, TStudentSchema } from "@/schema/student";
import { StudentRecord } from "@/types/student";
import StudentForm from "@/components/custom/forms/student";
import { BranchRecord } from "@/types/branch";
import { BatchRecord } from "@/types/batch";
import { StandardRecord } from "@/types/standard";
import { getDefaultsForStudentFormUpdate } from "@/actions/student/get";
import { isActionError } from "@/lib/utils";

export default function StudentCSR({
  defaultValue,
}: {
  defaultValue?: { records: StudentRecord[]; count: number };
}) {
  const pathname = usePathname();
  const form = useForm<TStudentSchema>({
    resolver: zodResolver(studentSchema),
    defaultValues: defaultValues(),
  });
  const [queryProps, setQueryProps] = useQueryStates(studentSearchParams, {
    history: "push",
  });
  const [chanllengeInputString, setChallengeInputString] = useState("");
  const [defaultFormValues, setDefaultFormValues] = useState<{
    branchList?: BranchRecord[];
    batchList?: BatchRecord[];
    standardList?: StandardRecord[];
  }>();

  const mc = useModuleConstructor<
    StudentRecord,
    TStudentSchema,
    StudentSearchParamProps
  >({
    queryOps: queryProps,
    get: {
      action: studentFetcher.get,
      onGetError(message) {
        toast.error(message);
      },
    },
    create: {
      action: studentFetcher.create,
      onCreateSuccess(data) {
        toast.success(`${data.name} added successfully`);
      },
      onCreateError(data) {
        toast.error(data);
      },
    },
    update: {
      action: studentFetcher.update,
      onUpdateSuccess(data) {
        toast.success(`${data.name} Updated Successfully`);
      },
      onUpdateError(data) {
        toast.error(data);
      },
    },
    delete: {
      action: studentFetcher.delete,
      onDeleteSuccess(data) {
        toast.success(data.message);
      },
      onDeleteError(data) {
        toast.error(data);
      },
    },
    editing: {
      async onEditStart(data) {
        const res = await getDefaultsForStudentFormUpdate({
          branchId: data.branch.id.toString(),
          batchId: data.batch.id.toString(),
          standardId: data.standard.id.toString(),
        });

        if (isActionError(res)) {
          toast.error(res.message);
          return mc.onActiveEditChange(mc.activeEdit)(false);
        }

        setDefaultFormValues({
          batchList: [
            {
              id: res.data.batch.id,
              branch: {
                id: res.data.branch.id,
                title: res.data.branch.title,
              },
              title: res.data.batch.title,
              timing: res.data.batch.timing,
              day: res.data.batch.day,
            },
          ],
          branchList: [res.data.branch],
          standardList: [res.data.standard],
        });

        form.reset({
          name: data.name,
          guardian: data.guardian,
          address: data.address,
          phone: data.phone,
          standardId: data.standard.id.toString(),
          branchId: data.branch.id.toString(),
          batchId: data.batch.id.toString(),
        });
      },
      onEditEnd() {
        form.reset(defaultValues());
        setDefaultFormValues(undefined);
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
                  <TableHead>Name</TableHead>
                  <TableHead>Guardian</TableHead>
                  <TableHead>Address</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Branch</TableHead>
                  <TableHead>Batch</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mc.loaders.isFetching &&
                  Array.from({ length: 6 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell colSpan={8}>
                        <Skeleton className="w-full h-10 rounded" />
                      </TableCell>
                    </TableRow>
                  ))}
                {mc.isEmpty && (
                  <TableRow>
                    <TableCell colSpan={8} className="">
                      <p className="flex justify-center py-5 text-muted-foreground italic">
                        No Data Found
                      </p>
                    </TableCell>
                  </TableRow>
                )}
                {!mc.loaders.isFetching &&
                  mc.data.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>{s.id}</TableCell>
                      <TableCell>
                        <b>{s.name}</b>
                        <p className="text-sm text-muted-foreground">
                          {s.phone}
                        </p>
                      </TableCell>
                      <TableCell>{s.guardian}</TableCell>
                      <TableCell>
                        <p className="text-wrap max-w-sm">{s.address}</p>
                      </TableCell>
                      <TableCell>{s.standard.title}</TableCell>
                      <TableCell>{s.branch.title}</TableCell>
                      <TableCell>{s.batch.title}</TableCell>
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
                            open={mc.isEditing(s.id)}
                            onOpenChange={mc.onActiveEditChange(s.id)}
                          >
                            <DialogHeader>
                              <DialogTitle>Edit</DialogTitle>
                            </DialogHeader>
                            <StudentForm
                              form={form}
                              onSubmit={(data) => mc.update(s.id, data)}
                              initialValues={{
                                batchList: defaultFormValues?.batchList,
                                branchList: defaultFormValues?.branchList,
                                standardList: defaultFormValues?.standardList,
                              }}
                            />
                          </MultiDialogContent>
                          <MultiDialogContent id="delete">
                            <DialogHeader>
                              <DialogTitle>Delete</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                              Are you sure want to delete{" "}
                              <code className="important">{s.name}</code>
                              &nbsp;situated at{" "}
                              {/* <code className="important">{b.address}</code> */}
                            </DialogDescription>
                            <div className="space-y-3 mt-3">
                              <Label className="text-muted-foreground">
                                Type <span className="important">{s.name}</span>{" "}
                                to continue
                              </Label>
                              <Input
                                placeholder={s.name}
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
                                    s.name !== chanllengeInputString
                                  }
                                  onClick={() => mc.deleteRecord(s.id)}
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
