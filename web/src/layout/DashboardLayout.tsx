import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import * as React from "react";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
	SidebarInset,
	SidebarProvider,
	SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/user-dashboard/app-sidebar";
import { useAuthStore } from "@/lib/authStore";

type DashboardLayoutProps = {
	children: ReactNode;
};
export default function DashboardLayout({ children }: DashboardLayoutProps) {
	const router = useRouter();
	const isInitializing = useAuthStore((s) => s.isInitializing);
	const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
	const user = useAuthStore((s) => s.user);

	React.useEffect(() => {
		if (isInitializing) {
			return;
		}

		if (!isAuthenticated) {
			router.navigate({ to: "/signin", replace: true });
			return;
		}

		if (user && user.role !== "User") {
			router.navigate({ to: "/unauthorized", replace: true });
		}
	}, [isAuthenticated, isInitializing, router, user]);

	if (isInitializing) {
		return null;
	}

	return (
		<SidebarProvider
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 72)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}
		>
			<AppSidebar variant="inset" />
			<SidebarInset>
				<header className="flex min-h-8 shrink-0 flex-wrap items-center gap-3 border-b py-4 px-4 transition-all ease-linear">
					{/* Left side */}
					<div className="flex flex-1 items-center gap-2">
						<SidebarTrigger className="-ms-1" />
						<div className="max-lg:hidden lg:contents">
							<Separator
								className="me-2 data-[orientation=vertical]:h-4"
								orientation="vertical"
							/>
							<Breadcrumb>
								<BreadcrumbList>
									<BreadcrumbItem className="hidden md:block">
										<BreadcrumbLink href="#">Home</BreadcrumbLink>
									</BreadcrumbItem>
									<BreadcrumbSeparator className="hidden md:block" />
									<BreadcrumbItem>
										<BreadcrumbPage>Dashboard</BreadcrumbPage>
									</BreadcrumbItem>
								</BreadcrumbList>
							</Breadcrumb>
						</div>
					</div>
					{/* Right side */}
				</header>
				<div className="flex flex-1 flex-col">
					<main className="flex-1">{children}</main>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
