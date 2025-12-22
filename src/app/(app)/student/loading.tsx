import BreadCrumbConstructor from "@/components/custom/bread-crumb-constructor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PlusIcon } from "lucide-react";

export default function Loading() {
  return (
    <div className="space-y-6">
      <section className="flex justify-between items-center">
        <BreadCrumbConstructor pathname={"/class"} />
        <Button>
          <PlusIcon />
          <span>New Student</span>
        </Button>
      </section>
      <section className="flex gap-5">
        <Skeleton className="w-full h-10 rounded" />
        <Skeleton className="h-10 w-20" />
      </section>
      <section>
        <Card>
          <CardContent className="space-y-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full rounded" />
            ))}
          </CardContent>
        </Card>
      </section>
      <section>
        <Card>
          <CardFooter></CardFooter>
        </Card>
      </section>
    </div>
  );
}
