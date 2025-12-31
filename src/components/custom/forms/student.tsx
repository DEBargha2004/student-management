import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { TStudentSchema } from "@/schema/student";
import { FormProps } from "@/types/form-props";
import {
  SearchSelect,
  SearchSelectContent,
  SearchSelectDropdown,
  SearchSelectInput,
  SearchSelectItem,
  SearchSelectTrigger,
} from "../search-select";
import { useWatch } from "react-hook-form";
import { getStandards } from "@/actions/standard/get";
import { catchError, isActionError } from "@/lib/utils";
import { StandardRecord } from "@/types/standard";
import { getBranches } from "@/actions/branch/get";
import { useEffect, useMemo, useState } from "react";
import { BranchRecord } from "@/types/branch";
import { getBatches } from "@/actions/batch/get";
import { BatchRecord } from "@/types/batch";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

function useSearchable<T>(
  fetcher: (q: string) => Promise<T[]>,
  initialValue: T[]
) {
  const [list, setList] = useState<T[]>(initialValue);

  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      setLoading(true);
      fetcher(query)
        .then((v) => {
          !controller.signal.aborted && setList(v);
        })
        .finally(() => {
          !controller.signal.aborted && setLoading(false);
        });
    }, 400);

    return () => {
      controller.abort();
      clearTimeout(timeout);
    };
  }, [query]);

  useEffect(() => {
    setList(initialValue);
  }, [initialValue.length]);

  return { list, loading, setQuery };
}

export default function StudentForm({
  form,
  onSubmit,
  initialValues,
}: FormProps<TStudentSchema> & {
  initialValues?: {
    branchList?: BranchRecord[];
    batchList?: BatchRecord[];
    standardList?: StandardRecord[];
  };
}) {
  const branchId = useWatch({
    control: form.control,
    name: "branchId",
  });

  const getStandardList = async (q: string) => {
    const [err, res] = await catchError(
      getStandards({ q, limit: 30, page: 1 })
    );

    if (err) throw new Error(err.message);
    if (isActionError(res)) throw new Error(res.message);

    return res.data.records;
  };

  const getBranchList = async (q: string) => {
    if (!q) return [];
    const [err, res] = await catchError(getBranches({ q, limit: 30, page: 1 }));

    if (err) throw new Error(err.message);
    if (isActionError(res)) throw new Error(res.message);

    return res.data.records;
  };

  const getBatchList = async (q: string) => {
    if (!branchId) return [];
    const [err, res] = await catchError(
      getBatches({ q, limit: 30, page: 1, branchId: Number(branchId) })
    );

    if (err) throw new Error(err.message);
    if (isActionError(res)) throw new Error(res.message);

    return res.data.records;
  };

  const branchSearchable = useSearchable(
    getBranchList,
    initialValues?.branchList ?? []
  );
  const standardSearchable = useSearchable(
    getStandardList,
    initialValues?.standardList ?? []
  );
  const batchSearchable = useSearchable(
    getBatchList,
    initialValues?.batchList ?? []
  );

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <section className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Debargha Saha" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="7005246393" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <FormField
          control={form.control}
          name="guardian"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guardian</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Chandra kumar saha" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Address</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="field-sizing-content resize-none max-h-40"
                  placeholder="Dhaleshwar Road 7"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <section className="grid grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="branchId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Branch</FormLabel>
                <FormControl>
                  <SearchSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    selector={(list, val) =>
                      list.find((i) => (i as BranchRecord).title === val)
                    }
                    list={branchSearchable.list}
                    loading={branchSearchable.loading}
                    onQueryChange={branchSearchable.setQuery}
                  >
                    <SearchSelectTrigger>
                      {(data) => (data as BranchRecord)?.title}
                    </SearchSelectTrigger>
                    <SearchSelectDropdown>
                      <SearchSelectInput />
                      <SearchSelectContent<StandardRecord>>
                        {(list) =>
                          list.map((li) => (
                            <SearchSelectItem key={li.id}>
                              {li.title}
                            </SearchSelectItem>
                          ))
                        }
                      </SearchSelectContent>
                    </SearchSelectDropdown>
                  </SearchSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="batchId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Batch</FormLabel>
                <FormControl>
                  <SearchSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    list={batchSearchable.list}
                    loading={batchSearchable.loading}
                    onQueryChange={batchSearchable.setQuery}
                    selector={(list, val) =>
                      list.find((i) => (i as BatchRecord)?.title === val)
                    }
                  >
                    <SearchSelectTrigger disabled={!branchId}>
                      {(data) => (data as BatchRecord)?.title}
                    </SearchSelectTrigger>
                    <SearchSelectDropdown>
                      <SearchSelectInput />
                      <SearchSelectContent<BatchRecord>>
                        {(list) =>
                          list.map((li) => (
                            <SearchSelectItem key={li.id}>
                              {li.title}
                            </SearchSelectItem>
                          ))
                        }
                      </SearchSelectContent>
                    </SearchSelectDropdown>
                  </SearchSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="standardId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Class</FormLabel>
                <FormControl>
                  <SearchSelect
                    value={field.value}
                    onValueChange={field.onChange}
                    list={standardSearchable.list}
                    onQueryChange={standardSearchable.setQuery}
                    loading={standardSearchable.loading}
                    selector={(list, val) =>
                      list.find((i) => (i as StandardRecord).title === val)
                    }
                  >
                    <SearchSelectTrigger>
                      {(data) => <span>{(data as StandardRecord)?.title}</span>}
                    </SearchSelectTrigger>
                    <SearchSelectDropdown>
                      <SearchSelectInput />
                      <SearchSelectContent<StandardRecord>>
                        {(list) =>
                          list.map((li) => (
                            <SearchSelectItem key={li.id}>
                              {li.title}
                            </SearchSelectItem>
                          ))
                        }
                      </SearchSelectContent>
                    </SearchSelectDropdown>
                  </SearchSelect>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </section>
        <Button
          className="w-full"
          disabled={form.formState.isSubmitting}
          type="submit"
        >
          {form.formState.isSubmitting ? (
            <Loader2 className="animate-spin" />
          ) : (
            <span>Create</span>
          )}
        </Button>
      </form>
    </Form>
  );
}
