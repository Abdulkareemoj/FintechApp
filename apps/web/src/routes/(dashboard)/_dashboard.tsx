import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { getAuthToken } from "@/lib/api-client";

// Define the protected route group
export const Route = createFileRoute("/(dashboard)/_dashboard")({
  // Before loading any child route, check for authentication
  beforeLoad: ({ location }) => {
    const token = getAuthToken();
    if (!token) {
      // Redirect unauthenticated users to the sign-in page
      throw redirect({
        to: "/auth/signin",
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: DashboardLayout,
});
