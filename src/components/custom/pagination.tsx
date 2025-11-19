import { useMemo } from "react";
import { Button } from "../ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../ui/pagination";

type PaginationProps = {
  totalRecords: number;
  currentPage: number;
  perPage: number;
  neighbourCount?: number;
  navigateTo: (page: number) => void;
};

type TPaginationItem =
  | {
      type: "number";
      value: number;
    }
  | { type: "ellipsis" };

export default function PaginationBuilder({
  currentPage,
  perPage,
  totalRecords,
  neighbourCount = 0,
  navigateTo,
}: PaginationProps) {
  const totalPages = Math.max(Math.ceil(totalRecords / perPage), 1);
  const currentPageIdx = currentPage - 1;

  const currentStart =
    totalRecords === 0
      ? 0
      : Math.min(totalPages - 1, currentPageIdx) * perPage + 1;
  const currentEnd =
    totalRecords === 0
      ? 0
      : Math.min(totalPages - 1, currentPageIdx) * perPage +
        (totalRecords % perPage);

  const prevPage = Math.max(1, currentPage - 1);
  const nextPage = Math.min(totalPages, currentPage + 1);

  const pagination = useMemo<TPaginationItem[]>(() => {
    const minNeighbourIndex = currentPageIdx - neighbourCount;
    const maxNeighboutIndex = currentPageIdx + neighbourCount;

    const paginationItems: TPaginationItem[] = [];

    const push = (item: TPaginationItem) => {
      if (item.type === "number") return paginationItems.push(item);

      if (
        item.type === "ellipsis" &&
        paginationItems.at(-1)?.type !== "ellipsis"
      )
        paginationItems.push(item);
    };

    for (let i = 0; i < totalPages; i++) {
      push(
        i === 0 || i === totalPages - 1
          ? { type: "number", value: i + 1 }
          : i >= minNeighbourIndex && i <= maxNeighboutIndex
          ? { type: "number", value: i + 1 }
          : { type: "ellipsis" }
      );
    }

    return paginationItems;
  }, [perPage, totalRecords, currentPage]);

  return (
    <div className="flex justify-between items-center w-full">
      <section className="w-fit text-muted-foreground">
        <span className="text-primary-foreground">
          {currentStart} - {currentEnd}&nbsp;
        </span>
        of <span className="text-primary-foreground">{totalRecords}</span>{" "}
        records
      </section>
      <section className="w-fit">
        <Pagination>
          <PaginationContent className="">
            <Button
              asChild
              className="p-0 cursor-pointer"
              onClick={() => navigateTo(prevPage)}
            >
              <PaginationItem>
                <PaginationPrevious className="hover:bg-primary/50!" />
              </PaginationItem>
            </Button>
            {pagination.map((p, p_idx) => (
              <PaginationItem key={p_idx}>
                {p.type === "number" ? (
                  <PaginationLink>{p.value}</PaginationLink>
                ) : (
                  <PaginationEllipsis />
                )}
              </PaginationItem>
            ))}

            <Button
              asChild
              className="p-0 cursor-pointer"
              onClick={() => navigateTo(nextPage)}
            >
              <PaginationItem>
                <PaginationNext className="hover:bg-primary/50!" />
              </PaginationItem>
            </Button>
          </PaginationContent>
        </Pagination>
      </section>
    </div>
  );
}
