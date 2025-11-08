"use client";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon } from "lucide-react";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div>
      <Alert variant={"destructive"}>
        <AlertCircleIcon />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error.message}</AlertDescription>
      </Alert>
    </div>
  );
}
