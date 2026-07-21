import { useRouter } from "@tanstack/react-router";
import type { ReactNode } from "react";
import * as React from "react";
import { AppSidebar } from "@/components/merchant-dashboard/app-sidebar";
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

		if (user && user.role !== "Merchant") {
			router.navigate({ to: "/unauthorized", replace: true });
		}
	}, [isAuthenticated, isInitializing, router, user]);

	if (isInitializing) {
		return null;
	}

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<div className="px-2 md:px-4">
					<div className="mx-auto w-full">
						<header className="flex min-h-8 shrink-0 flex-wrap items-center gap-3 border-b py-4 transition-all ease-linear">
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
						<div className="overflow-hidden">
							<main className="flex-1">{children}</main>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
