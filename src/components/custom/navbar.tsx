"use client";

import { cn } from "@/lib/utils";
import { ModeToggle } from "./mode-toggle";
import AppLogo from "./app-logo";
import { useSidebar } from "../ui/sidebar";
import { Button } from "../ui/button";
import { AlignJustifyIcon } from "lucide-react";

export default function Navbar({
  className,
  ...props
}: React.ComponentProps<"nav">) {
  const { isMobile, toggleSidebar } = useSidebar();
  return (
    <nav
      className={cn(
        "border-b border-accent flex gap-3 justify-between items-center px-3",
        className
      )}
      {...props}
    >
      {!!isMobile && (
        <Button size={"icon"} variant={"secondary"} onClick={toggleSidebar}>
          <AlignJustifyIcon />
        </Button>
      )}
      <AppLogo className="mr-auto" />
      <ModeToggle />
    </nav>
  );
}
