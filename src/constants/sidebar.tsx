import {
  Building2Icon,
  GraduationCapIcon,
  IndianRupeeIcon,
  LayoutIcon,
  LucideIcon,
  UserIcon,
  UserRoundIcon,
  UsersRoundIcon,
} from "lucide-react";

type TSidebarItem = {
  id: string;
  icon: LucideIcon;
  label: string;
  href: string;
  pattern?: RegExp;
  isActive: (pathname: string) => boolean;
};

export const sidebarItems: TSidebarItem[] = [
  {
    id: "dashboard",
    icon: LayoutIcon,
    label: "Dashboard",
    href: "/",
    isActive(pathname) {
      return this.href === pathname;
    },
  },
  {
    id: "branch",
    icon: Building2Icon,
    label: "Branch",
    href: "/branch",
    pattern: /^\/branch/,
    isActive(pathname) {
      return this.pattern!.test(pathname);
    },
  },
  {
    id: "batch",
    icon: UsersRoundIcon,
    label: "Batch",
    href: "/batch",
    pattern: /^\/batch/,
    isActive(pathname) {
      return this.pattern!.test(pathname);
    },
  },
  {
    id: "student",
    icon: UserRoundIcon,
    label: "Student",
    href: "/student",
    pattern: /^\/student/,
    isActive(pathname) {
      return this.pattern!.test(pathname);
    },
  },
  {
    id: "fees",
    icon: IndianRupeeIcon,
    label: "Fees",
    href: "/fees",
    pattern: /^\/fees/,
    isActive(pathname) {
      return this.pattern!.test(pathname);
    },
  },
  {
    id: "class",
    icon: GraduationCapIcon,
    label: "Class",
    href: "/class",
    pattern: /^\/class/,
    isActive(pathname) {
      return this.pattern!.test(pathname);
    },
  },
];
