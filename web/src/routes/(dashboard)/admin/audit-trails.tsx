import { createFileRoute } from "@tanstack/react-router";
import {
	AlertTriangle,
	Download,
	Eye,
	LogIn,
	Search,
	Settings,
	Shield,
	Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import AdminLayout from "@/layout/AdminLayout";

export const Route = createFileRoute("/(dashboard)/admin/audit-trails")({
	component: AdminAudit,
});

interface AuditEvent {
	id: string;
	action: string;
	category: "auth" | "admin" | "system" | "security" | "user";
	user: string;
	email: string;
	ip: string;
	timestamp: string;
	details: string;
	severity: "info" | "warning" | "critical";
}

const mockEvents: AuditEvent[] = [
	{
		id: "AUD-001",
		action: "User Login",
		category: "auth",
		user: "John Doe",
		email: "john@finova.com",
		ip: "192.168.1.100",
		timestamp: "2026-03-15T14:32:00Z",
		details: "Successful login from trusted device",
		severity: "info",
	},
	{
		id: "AUD-002",
		action: "Role Change",
		category: "admin",
		user: "Sarah Admin",
		email: "sarah@finova.com",
		ip: "10.0.0.45",
		timestamp: "2026-03-15T13:15:00Z",
		details: "Promoted user jane.smith@email.com to Support role",
		severity: "warning",
	},
	{
		id: "AUD-003",
		action: "Failed Login Attempt",
		category: "security",
		user: "Unknown",
		email: "unknown@external.com",
		ip: "203.0.113.50",
		timestamp: "2026-03-15T12:58:00Z",
		details: "5 failed attempts for account admin@finova.com",
		severity: "critical",
	},
	{
		id: "AUD-004",
		action: "System Config Update",
		category: "system",
		user: "System",
		email: "system@finova.com",
		ip: "127.0.0.1",
		timestamp: "2026-03-15T11:30:00Z",
		details: "Transaction fee limit updated from 2.5% to 3.0%",
		severity: "info",
	},
	{
		id: "AUD-005",
		action: "User Account Suspended",
		category: "admin",
		user: "Sarah Admin",
		email: "sarah@finova.com",
		ip: "10.0.0.45",
		timestamp: "2026-03-15T10:45:00Z",
		details: "Account suspended due to suspicious activity flag",
		severity: "warning",
	},
	{
		id: "AUD-006",
		action: "New Admin Created",
		category: "admin",
		user: "Super Admin",
		email: "super@finova.com",
		ip: "10.0.0.1",
		timestamp: "2026-03-15T09:20:00Z",
		details: "New admin account created for mike.ops@finova.com",
		severity: "warning",
	},
	{
		id: "AUD-007",
		action: "Permission Change",
		category: "security",
		user: "Super Admin",
		email: "super@finova.com",
		ip: "10.0.0.1",
		timestamp: "2026-03-15T08:15:00Z",
		details: "Modified permissions for Support role group",
		severity: "critical",
	},
	{
		id: "AUD-008",
		action: "User Logout",
		category: "auth",
		user: "Jane Smith",
		email: "jane@finova.com",
		ip: "192.168.1.55",
		timestamp: "2026-03-15T07:50:00Z",
		details: "Session ended normally",
		severity: "info",
	},
	{
		id: "AUD-009",
		action: "Data Export",
		category: "user",
		user: "Mike Johnson",
		email: "mike@finova.com",
		ip: "192.168.1.200",
		timestamp: "2026-03-15T06:30:00Z",
		details: "Exported transaction report (last 30 days)",
		severity: "info",
	},
	{
		id: "AUD-010",
		action: "API Key Generated",
		category: "system",
		user: "Merchant Corp",
		email: "dev@merchantcorp.com",
		ip: "45.33.32.156",
		timestamp: "2026-03-14T23:10:00Z",
		details: "New production API key generated for Merchant Corp",
		severity: "info",
	},
];

const severityConfig = {
	info: { label: "Info", variant: "default" as const },
	warning: { label: "Warning", variant: "secondary" as const },
	critical: { label: "Critical", variant: "destructive" as const },
};

const categoryIcons = {
	auth: LogIn,
	admin: Shield,
	system: Settings,
	security: AlertTriangle,
	user: Users,
};

function AdminAudit() {
	const [search, setSearch] = useState("");
	const [categoryFilter, setCategoryFilter] = useState("all");
	const [severityFilter, setSeverityFilter] = useState("all");

	const filtered = mockEvents.filter((e) => {
		const matchesSearch =
			search === "" ||
			e.action.toLowerCase().includes(search.toLowerCase()) ||
			e.user.toLowerCase().includes(search.toLowerCase()) ||
			e.email.toLowerCase().includes(search.toLowerCase()) ||
			e.id.toLowerCase().includes(search.toLowerCase());
		const matchesCategory =
			categoryFilter === "all" || e.category === categoryFilter;
		const matchesSeverity =
			severityFilter === "all" || e.severity === severityFilter;
		return matchesSearch && matchesCategory && matchesSeverity;
	});

	return (
		<AdminLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-8 px-6 py-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<div className="mb-8">
							<h1 className="font-bold text-3xl text-foreground tracking-tight">
								Audit Trails
							</h1>
							<p className="mt-1 text-muted-foreground">
								Track every action across the platform — security events, admin
								changes, and system activity.
							</p>
						</div>

						{/* Stats */}
						<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Total Events
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">12,847</div>
									<p className="mt-1 text-xs text-muted-foreground">
										Last 30 days
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Critical Events
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl text-destructive">23</div>
									<p className="mt-1 text-xs text-muted-foreground">
										Requires review
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Active Sessions
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">1,432</div>
									<p className="mt-1 text-xs text-muted-foreground">
										Currently active
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Failed Logins
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl text-warning">89</div>
									<p className="mt-1 text-xs text-muted-foreground">
										Last 24 hours
									</p>
								</CardContent>
							</Card>
						</div>

						{/* Filters */}
						<div className="mb-6 flex flex-wrap items-center gap-3">
							<div className="relative flex-1 sm:max-w-xs">
								<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
								<Input
									className="pl-9"
									placeholder="Search events, users, IDs..."
									value={search}
									onChange={(e) => setSearch(e.target.value)}
								/>
							</div>
							<Select
								value={categoryFilter}
								onValueChange={setCategoryFilter}
							>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Category" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Categories</SelectItem>
									<SelectItem value="auth">Authentication</SelectItem>
									<SelectItem value="admin">Admin Actions</SelectItem>
									<SelectItem value="system">System</SelectItem>
									<SelectItem value="security">Security</SelectItem>
									<SelectItem value="user">User Activity</SelectItem>
								</SelectContent>
							</Select>
							<Select
								value={severityFilter}
								onValueChange={setSeverityFilter}
							>
								<SelectTrigger className="w-[150px]">
									<SelectValue placeholder="Severity" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="all">All Severity</SelectItem>
									<SelectItem value="info">Info</SelectItem>
									<SelectItem value="warning">Warning</SelectItem>
									<SelectItem value="critical">Critical</SelectItem>
								</SelectContent>
							</Select>
							<Button variant="outline" size="icon" className="ml-auto">
								<Download className="h-4 w-4" />
							</Button>
						</div>

						{/* Table */}
						<Card>
							<CardHeader className="pb-3">
								<CardTitle>Event Log</CardTitle>
								<CardDescription>
									Showing {filtered.length} of {mockEvents.length} events
								</CardDescription>
							</CardHeader>
							<CardContent className="p-0">
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Event ID</TableHead>
											<TableHead>Action</TableHead>
											<TableHead>User</TableHead>
											<TableHead>IP Address</TableHead>
											<TableHead>Timestamp</TableHead>
											<TableHead>Severity</TableHead>
											<TableHead className="w-10" />
										</TableRow>
									</TableHeader>
									<TableBody>
										{filtered.map((event, i) => {
											const Icon = categoryIcons[event.category];
											const sev = severityConfig[event.severity];
											return (
												<TableRow key={event.id}>
													<TableCell className="font-mono text-xs text-muted-foreground">
														{event.id}
													</TableCell>
													<TableCell>
														<div className="flex items-center gap-2">
															<Icon className="h-4 w-4 text-muted-foreground" />
															<span className="font-medium">{event.action}</span>
														</div>
														<div className="mt-0.5 text-xs text-muted-foreground">
															{event.details}
														</div>
													</TableCell>
													<TableCell>
														<div className="font-medium">{event.user}</div>
														<div className="text-xs text-muted-foreground">
															{event.email}
														</div>
													</TableCell>
													<TableCell className="font-mono text-xs">
														{event.ip}
													</TableCell>
													<TableCell className="text-sm text-muted-foreground">
														{new Date(event.timestamp).toLocaleString()}
													</TableCell>
													<TableCell>
														<Badge variant={sev.variant}>{sev.label}</Badge>
													</TableCell>
													<TableCell>
														<Button variant="ghost" size="icon">
															<Eye className="h-4 w-4" />
														</Button>
													</TableCell>
												</TableRow>
											);
										})}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</motion.div>
				</main>
			</div>
		</AdminLayout>
	);
}
