import AppSidebar from "@/components/custom/app-sidebar";
import Navbar from "@/components/custom/navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { cookies } from "next/headers";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <main className="flex justify-start w-full">
        <AppSidebar />
        <div className="flex-1 flex flex-col">
          <Navbar className="h-16 sticky top-0 z-50 bg-background" />
          <div className="p-4 flex-1">{children}</div>
        </div>
      </main>
    </SidebarProvider>
  );
}
