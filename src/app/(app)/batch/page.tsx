import { isActionError } from "@/lib/utils";
import BatchCSR from "./_components/batch-csr";
import { batchFetcher, loadBatchSearchParams } from "./_components/fetcher";
import { SearchParams } from "nuqs/server";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const props = await loadBatchSearchParams(searchParams);

  const res = await batchFetcher.get(props);

  if (isActionError(res)) throw new Error(res.message);

  return <BatchCSR defaultValue={res.data} />;
}
