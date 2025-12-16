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

export default function StudentForm({
  form,
  onSubmit,
}: FormProps<TStudentSchema>) {
  const branchId = useWatch({
    control: form.control,
    name: "branchId",
  });

  const handleGetStandardList = async (q: string) => {
    const [err, res] = await catchError(
      getStandards({ q, limit: 30, page: 1 })
    );

    if (err) throw new Error(err.message);
    if (isActionError(res)) throw new Error(res.message);

    return res.data.records;
  };

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
          name="gaurdian"
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
                  <SearchSelect>
                    <SearchSelectTrigger />
                    <SearchSelectDropdown>
                      <SearchSelectInput />
                      <SearchSelectContent>
                        {(list) =>
                          list.map((li) => (
                            <SearchSelectItem></SearchSelectItem>
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
                  <SearchSelect>
                    <SearchSelectTrigger disabled={!branchId} />
                    <SearchSelectDropdown></SearchSelectDropdown>
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
                  <SearchSelect getData={handleGetStandardList}>
                    <SearchSelectTrigger />
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
      </form>
    </Form>
  );
}
