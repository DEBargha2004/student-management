"use client";

import { cn } from "@/lib/utils";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { EyeClosedIcon, EyeIcon } from "lucide-react";

export default function PasswordInput({
  className,
  ...props
}: React.ComponentProps<"input">) {
  const [showPass, setShowPass] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPass((v) => !v);
  };
  return (
    <div className={cn("relative", className)}>
      <Input {...props} type={showPass ? "text" : "password"} />
      <Button
        type="button"
        variant={"ghost"}
        size={"icon"}
        className="absolute right-0 top-0"
        onClick={togglePasswordVisibility}
      >
        {showPass ? <EyeIcon /> : <EyeClosedIcon />}
      </Button>
    </div>
  );
}
