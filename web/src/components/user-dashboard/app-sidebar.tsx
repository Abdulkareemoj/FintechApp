import { Link } from "@tanstack/react-router";
import {
	ArrowLeftRight,
	BarChart3,
	Bell,
	ChevronDown,
	CreditCard,
	DollarSign,
	DownloadIcon,
	HelpCircle,
	HouseWifi,
	Info,
	LayoutDashboard,
	LifeBuoy,
	LogOut,
	Menu,
	Receipt,
	Search,
	SearchCheck,
	Send,
	Settings,
	Settings2,
	TrendingUp,
	Wallet,
	X,
} from "lucide-react";
import type * as React from "react";
import { SearchForm } from "@/components/shared/search-form";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarRail,
} from "@/components/ui/sidebar";
import { NavUser } from "../shared/nav-user";
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { useAuthStore } from "@/lib/authStore";

// Updated navigation data to match your backend controllers
const data = {
	user: {
		name: "shadcn",
		email: "m@example.com",
		avatar: "/avatars/shadcn.jpg",
	},
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
	],
	navSecondary: [
		{
			title: "Settings",
			url: "/dashboard/settings",
			icon: Settings2,
		},
		{
			title: "Get Help",
			url: "/dashboard/support",
			icon: HelpCircle,
		},
		{
			title: "Search",
			url: "#",
			icon: SearchCheck,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useAuthStore();

	// Transform auth user to nav user format
	const navUser = user ? {
		name: `${user.firstName} ${user.lastName}`,
		email: user.email,
		avatar: "/avatars/default.jpg", // You can update this with actual avatar URL
	} : {
		name: "Guest User",
		email: "guest@example.com",
		avatar: "/avatars/default.jpg",
	};

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							asChild
							className="data-[slot=sidebar-menu-button]:!p-1.5"
						>
							<Link to="/">
								<HouseWifi className="!size-5" />
								<span className="text-base font-semibold">Acme Inc.</span>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavSecondary items={data.navSecondary} className="mt-auto" />
			</SidebarContent>
			<SidebarFooter>
				<NavUser user={navUser} />
			</SidebarFooter>
		</Sidebar>
	);
}
