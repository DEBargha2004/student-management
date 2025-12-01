import { isActionError } from "@/lib/utils";
import BatchCSR from "./_components/standard-csr";
import { standardFetcher, loadBatchSearchParams } from "./_components/fetcher";
import { SearchParams } from "nuqs/server";
import StandardCSR from "./_components/standard-csr";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const props = await loadBatchSearchParams(searchParams);

  const res = await standardFetcher.get(props);

  if (isActionError(res)) throw new Error(res.message);

  return <StandardCSR defaultValue={res.data} />;
}
