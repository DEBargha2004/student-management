import { isActionError } from "@/lib/utils";
import BranchCSR from "./_components/branch-csr";
import { branchFetcher, loadBranchSearchParams } from "./_components/fetcher";
import { SearchParams } from "nuqs/server";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const props = await loadBranchSearchParams(searchParams);

  const res = await branchFetcher.get(props);

  if (isActionError(res)) throw new Error(res.message);

  return <BranchCSR defaultValue={res.data} />;
}
