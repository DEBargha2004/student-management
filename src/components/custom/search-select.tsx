"use client";

import { CheckIcon, ChevronDownIcon, Loader2, Loader2Icon } from "lucide-react";
import { createContext, useContext, useEffect, useId, useState } from "react";

import { catchError, cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Label } from "@/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Id } from "@/hooks/use-module-constructor";
import { Input } from "../ui/input";
import { toast } from "sonner";

// export default function SearchSelect() {
//   const id = useId();
//   const [open, setOpen] = useState<boolean>(false);
//   const [value, setValue] = useState<string>("");

//   return (
//     <div className="*:not-first:mt-2">
//       <Label htmlFor={id}>Select with search</Label>
//       <Popover onOpenChange={setOpen} open={open}>
//         <PopoverTrigger asChild>
//           <Button
//             aria-expanded={open}
//             className="w-full justify-between border-input bg-background px-3 font-normal outline-none outline-offset-0 hover:bg-background focus-visible:outline-[3px]"
//             id={id}
//             role="combobox"
//             variant="outline"
//           >
//             <span className={cn("truncate", !value && "text-muted-foreground")}>
//               {value
//                 ? frameworks.find((framework) => framework.value === value)
//                     ?.label
//                 : "Select framework"}
//             </span>
//             <ChevronDownIcon
//               aria-hidden="true"
//               className="shrink-0 text-muted-foreground/80"
//               size={16}
//             />
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent
//           align="start"
//           className="w-full min-w-(--radix-popper-anchor-width) border-input p-0"
//         >
//           <Command>
//             <CommandInput placeholder="Search framework..." />
//             <CommandList>
//               <CommandEmpty>No framework found.</CommandEmpty>
//               <CommandGroup>
//                 {frameworks.map((framework) => (
//                   <CommandItem
//                     key={framework.value}
//                     onSelect={(currentValue) => {
//                       setValue(currentValue === value ? "" : currentValue);
//                       setOpen(false);
//                     }}
//                     value={framework.value}
//                   >
//                     {framework.label}
//                     {value === framework.value && (
//                       <CheckIcon className="ml-auto" size={16} />
//                     )}
//                   </CommandItem>
//                 ))}
//               </CommandGroup>
//             </CommandList>
//           </Command>
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// }
type TData = { id: Id } & Record<string, any>;

type TSearchSelectProps<T extends unknown = TData> = {
  value?: string;
  onValueChange?: (selector: string) => void;
  children?: React.ReactNode;
  onQueryChange?: (q: string) => void;
  list: T[];
  loading?: boolean;
  selector?: (list: TData[], val: string) => TData | undefined;
};

type TSearchSelectContext<T extends unknown = TData> = {
  selected?: T;
  list: T[];
  isLoading: boolean;
  query: string;
  setQuery: (q: string) => void;
  handleSelect: (selector: string) => void;
};

type TSearchSelectTriggerProps = {
  children?: (data?: TData) => React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
};

type TSearchSelectInputProps = {
  placeholder?: string;
};

type TSearchSelectContentProps<T extends TData = TData> = {
  children?: (list: T[]) => React.ReactNode;
};

type TSearchSelectDropdown = { children?: React.ReactNode };

type TSearchSelectItemProps = {
  children?: React.ReactNode;
};

const SearchSelectContext = createContext<TSearchSelectContext | null>(null);

const useSearchSelect = () => {
  const context = useContext(SearchSelectContext);
  if (!context)
    throw new Error("useSearchSelect must be used inside SearchSelectContext");

  return context;
};

export function SearchSelect({
  value,
  onValueChange,
  children,
  list,
  loading,
  onQueryChange,
  selector,
}: TSearchSelectProps) {
  const [selected, setSelected] = useState<TData>();
  const [popoverOpen, setPopoverOpen] = useState(false);
  const [query, setQuery] = useState("");

  const handleSelect = (val: string) => {
    const selected = selector?.(list, val);
    if (!selected) return;

    setSelected(selected);
    onValueChange?.(selected.id.toString());

    setPopoverOpen(false);
  };

  useEffect(() => {
    if (!list.length) return;
    const selected = list.find((li) => li.id.toString() == value);
    if (selected) setSelected(selected);
  }, [list.length]);

  useEffect(() => {
    onQueryChange?.(query);
  }, [query]);

  // console.log("SearchSelect selected:", selected);

  return (
    <SearchSelectContext.Provider
      value={{
        list,
        selected,
        isLoading: loading ?? false,
        query,
        setQuery,
        handleSelect,
      }}
    >
      <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
        {children}
      </Popover>
    </SearchSelectContext.Provider>
  );
}

export function SearchSelectTrigger({
  children,
  placeholder,
  disabled,
}: TSearchSelectTriggerProps) {
  const { selected } = useSearchSelect();

  return (
    <PopoverTrigger asChild>
      <Button
        variant={"outline"}
        className="cursor-pointer flex justify-between items-center"
        disabled={disabled}
      >
        <div>{children?.(selected) ?? placeholder}</div>
        <ChevronDownIcon size={16} />
      </Button>
    </PopoverTrigger>
  );
}

export function SearchSelectDropdown({ children }: TSearchSelectDropdown) {
  return (
    <PopoverContent className="w-(--radix-popover-trigger-width) p-0">
      <Command>{children}</Command>
    </PopoverContent>
  );
}

export function SearchSelectInput({ placeholder }: TSearchSelectInputProps) {
  const { query, setQuery } = useSearchSelect();
  return (
    <CommandInput
      placeholder={placeholder}
      value={query}
      onValueChange={(e) => setQuery(e)}
    />
  );
}

export function SearchSelectContent<T extends TData = TData>({
  children,
}: TSearchSelectContentProps<T>) {
  const { list, isLoading } = useSearchSelect();
  const showList = !isLoading && !!list.length;
  // console.log("SearchSelectContent list:", list);
  return (
    <CommandList>
      <CommandEmpty className="h-16 grid place-content-center">
        {isLoading ? (
          <Loader2Icon className="animate-spin size-4" />
        ) : (
          <span className="text-muted-foreground text-sm">
            No Results Found
          </span>
        )}
      </CommandEmpty>
      {showList && <CommandGroup>{children?.(list as T[])}</CommandGroup>}
    </CommandList>
  );
}

export function SearchSelectItem({ children }: TSearchSelectItemProps) {
  const { handleSelect } = useSearchSelect();
  return <CommandItem onSelect={handleSelect}>{children}</CommandItem>;
}
