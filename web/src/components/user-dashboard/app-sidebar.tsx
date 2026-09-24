import { Link } from "@tanstack/react-router";
import {
	ArrowLeftRight,
	BarChart3,
	Bell,
	BellRing,
	CreditCard,
	DownloadIcon,
	FileText,
	HelpCircle,
	HouseWifi,
	LayoutDashboard,
	Receipt,
	Send,
	Settings2,
	TrendingUp,
	UserRound,
	Wallet,
} from "lucide-react";
import type * as React from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/lib/authStore";
import { NavUser } from "../shared/nav-user";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";

// Updated navigation data to match your backend controllers
const data = {
	navMain: [
		{ icon: LayoutDashboard, title: "Overview", url: "/dashboard" },
		{ icon: Wallet, title: "Accounts", url: "/dashboard/accounts" },
		{ icon: CreditCard, title: "Cards", url: "/dashboard/cards" },
		{
			icon: ArrowLeftRight,
			title: "Transactions",
			url: "/dashboard/transactions",
		},
		{ icon: Send, title: "Send Money", url: "/dashboard/send-money" },
		{ icon: DownloadIcon, title: "Top Up", url: "/dashboard/top-up" },
		{ icon: Receipt, title: "Bills", url: "/dashboard/bills" },
		{ icon: TrendingUp, title: "Analytics", url: "/dashboard/analytics" },
		{ icon: BarChart3, title: "Reports", url: "/dashboard/reports" },
		{ icon: FileText, title: "Statements", url: "/dashboard/statements" },
		{ icon: UserRound, title: "Profile", url: "/dashboard/profile" },
	],
	navSecondary: [
		{
			title: "Support tickets",
			url: "/dashboard/support",
			icon: HelpCircle,
		},
		{
			title: "Help Center",
			url: "/dashboard/support/help",
			icon: HelpCircle,
		},
		{
			title: "Messages",
			url: "/dashboard/support/messages",
			icon: Bell,
		},
		{
			title: "Notifications",
			url: "/dashboard/notifications",
			icon: BellRing,
		},
		{
			title: "Settings",
			url: "/dashboard/settings",
			icon: Settings2,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useAuthStore();

	const navUser = {
		name: `${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim(),
		email: user?.email ?? "",
		avatar: "/avatars/default.jpg",
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:p-1.5!"
						>
							<Link to="/">
								<HouseWifi className="size-5!" />
								<span className="text-base font-semibold">Acme Inc.</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavSecondary
					items={data.navSecondary}
					label="Support"
					className="mt-auto"
				/>
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={navUser} />
			</SidebarFooter>
		</Sidebar>
	);
}
