import { isActionError } from "@/lib/utils";
import { studentFetcher, loadStudentSearchParams } from "./_components/fetcher";
import { SearchParams } from "nuqs/server";
import StudentCSR from "./_components/student-csr";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const props = await loadStudentSearchParams(searchParams);

  const res = await studentFetcher.get(props);

  if (isActionError(res)) throw new Error(res.message);

  return <StudentCSR defaultValue={res.data} />;
}
