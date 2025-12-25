import { createFileRoute, Outlet } from "@tanstack/react-router";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNavigation } from "@/components/ui/sidebar-navigation";

export const Route = createFileRoute("/(dashboard)/_layout")({
  component: DashboardLayout,
});

function DashboardLayout() {
  return (
    <SidebarProvider>
      <SidebarNavigation />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
