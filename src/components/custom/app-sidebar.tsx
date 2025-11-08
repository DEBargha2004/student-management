"use client";

import { sidebarItems } from "@/constants/sidebar";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "../ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelRightCloseIcon, PanelRightOpenIcon } from "lucide-react";

export default function AppSidebar() {
  const pathname = usePathname();
  const { toggleSidebar, open } = useSidebar();
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarItems.map((si) => (
                <SidebarMenuItem key={si.id}>
                  <SidebarMenuButton
                    asChild
                    isActive={si.isActive(pathname)}
                    tooltip={si.label}
                  >
                    <Link href={si.href}>
                      <si.icon />
                      <span>{si.label}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={toggleSidebar}>
              {open ? <PanelRightOpenIcon /> : <PanelRightCloseIcon />}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
