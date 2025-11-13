import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

type PaginationProps = {
  total: number;
  current: any;
  perPage: number;
};

type TPaginationItem =
  | {
      type: "number";
      value: number;
    }
  | { type: "ellipsis" };

export default function PaginationBuilder({
  current,
  perPage,
  total,
}: PaginationProps) {
  const first = 1;
  const last = Math.ceil(total / perPage) || 1;
  return (
    <Pagination>
      <PaginationContent className="">
        <Button asChild className="p-0 cursor-pointer">
          <PaginationItem>
            <PaginationPrevious className="hover:bg-primary/50!" />
          </PaginationItem>
        </Button>
        <PaginationItem>
          <PaginationLink href="#">1</PaginationLink>
        </PaginationItem>
        <Button asChild className="p-0 cursor-pointer">
          <PaginationItem>
            <PaginationNext className="hover:bg-primary/50!" />
          </PaginationItem>
        </Button>
      </PaginationContent>
    </Pagination>
  );
}
