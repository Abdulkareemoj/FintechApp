import { Link } from "@tanstack/react-router";
import {
  ArrowLeftRight,
  BarChart3,
  Bell,
  ChevronDown,
  CreditCard,
  DollarSign,
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
import { NavMain } from "./nav-main";
import { NavSecondary } from "./nav-secondary";
import { NavUser } from "../shared/nav-user";

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
        { icon: Send, title: "Send Money", url: "/dashboard/send" },
        { icon: Receipt, title: "Bills", url: "/dashboard/bills" },
        { icon: TrendingUp, title: "Analytics", url: "/dashboard/analytics" },
        { icon: BarChart3, title: "Reports", url: "/dashboard/reports" },
      
    
 
  ], navSecondary: [
    {
      title: "Settings",
      url: "/settings",
      icon: Settings2,
    },
    {
      title: "Get Help",
      url: "#",
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
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="#">
                <HouseWifi className="!size-5" />
                <span className="text-base font-semibold">Acme Inc.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
