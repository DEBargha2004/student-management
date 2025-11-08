import { getBreadCrumbElements } from "@/lib/utils";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

export default function BreadCrumbConstructor({
  pathname,
}: {
  pathname: string;
}) {
  const elements = getBreadCrumbElements(pathname);

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {elements.map((e, idx) => (
          <BreadcrumbItem key={e.href}>
            <BreadcrumbLink href={e.href}>{e.label}</BreadcrumbLink>
            {idx !== elements.length - 1 && <BreadcrumbSeparator />}
          </BreadcrumbItem>
        ))}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
