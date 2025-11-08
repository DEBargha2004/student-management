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
  Trash2Icon,
} from "lucide-react";
import { usePathname } from "next/navigation";
import { useForm } from "react-hook-form";
import { branchFetcher, branchSearchParams, SearchParamProps } from "./fetcher";
import BranchForm from "@/components/custom/forms/branch";
import { useEffect } from "react";
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

  const mc = useModuleConstructor<TDBBranch, TBranchSchema, SearchParamProps>(
    {
      queryOps: queryProps,
      get: branchFetcher.get,
      create: branchFetcher.create,
      update: branchFetcher.update,
      delete: branchFetcher.delete,
    },
    defaultValue
  );

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
                {mc.data.map((b) => (
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
                        <MultiDialogContent id="edit">
                          <DialogHeader>
                            <DialogTitle>Edit</DialogTitle>
                          </DialogHeader>
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
          <CardFooter></CardFooter>
        </Card>
      </section>
    </div>
  );
}
