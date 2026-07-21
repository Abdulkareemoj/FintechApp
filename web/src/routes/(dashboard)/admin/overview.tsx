import { createFileRoute } from "@tanstack/react-router";
import {
	Activity,
	AlertTriangle,
	ArrowLeftRight,
	CheckCircle,
	Clock,
	Cpu,
	Database,
	DollarSign,
	Server,
	TrendingUp,
	Users,
	Wifi,
} from "lucide-react";
import { motion } from "motion/react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import AdminLayout from "@/layout/AdminLayout";

export const Route = createFileRoute("/(dashboard)/admin/overview")({
	component: AdminOverview,
});

const kpiData = [
	{
		title: "Total Users",
		value: "124,892",
		change: "+12.5%",
		changeType: "positive" as const,
		icon: Users,
		description: "vs last month",
	},
	{
		title: "Active Transactions",
		value: "8,432",
		change: "+8.2%",
		changeType: "positive" as const,
		icon: ArrowLeftRight,
		description: "last 24 hours",
	},
	{
		title: "Total Volume",
		value: "$45.2M",
		change: "+18.7%",
		changeType: "positive" as const,
		icon: DollarSign,
		description: "this month",
	},
	{
		title: "Platform Fees",
		value: "$892,450",
		change: "+15.3%",
		changeType: "positive" as const,
		icon: TrendingUp,
		description: "revenue MTD",
	},
];

const transactionVolumeData = [
	{ date: "Mon", volume: 4_500_000, transactions: 1200 },
	{ date: "Tue", volume: 5_200_000, transactions: 1450 },
	{ date: "Wed", volume: 4_800_000, transactions: 1320 },
	{ date: "Thu", volume: 6_100_000, transactions: 1680 },
	{ date: "Fri", volume: 7_200_000, transactions: 1950 },
	{ date: "Sat", volume: 5_800_000, transactions: 1520 },
	{ date: "Sun", volume: 4_200_000, transactions: 1100 },
];

const pendingAlerts = [
	{
		id: 1,
		type: "KYC",
		message: "42 pending KYC verifications",
		priority: "high",
	},
	{
		id: 2,
		type: "Transaction",
		message: "15 flagged transactions need review",
		priority: "high",
	},
	{
		id: 3,
		type: "Support",
		message: "8 escalated support tickets",
		priority: "medium",
	},
	{
		id: 4,
		type: "System",
		message: "Scheduled maintenance in 2 hours",
		priority: "low",
	},
];

const systemHealth = [
	{ name: "API Server", status: "operational", uptime: 99.99, icon: Server },
	{ name: "Database", status: "operational", uptime: 99.98, icon: Database },
	{ name: "Payment Gateway", status: "operational", uptime: 99.95, icon: Cpu },
	{ name: "External Services", status: "degraded", uptime: 98.5, icon: Wifi },
];

const recentActivity = [
	{
		id: 1,
		action: "User verified",
		user: "john.doe@email.com",
		time: "2 mins ago",
		type: "success",
	},
	{
		id: 2,
		action: "Transaction flagged",
		user: "TX-789456",
		time: "5 mins ago",
		type: "warning",
	},
	{
		id: 3,
		action: "Account suspended",
		user: "suspicious@test.com",
		time: "12 mins ago",
		type: "danger",
	},
	{
		id: 4,
		action: "Limit increased",
		user: "premium.user@email.com",
		time: "18 mins ago",
		type: "info",
	},
	{
		id: 5,
		action: "New registration",
		user: "new.user@email.com",
		time: "25 mins ago",
		type: "success",
	},
];
function AdminOverview() {
	return (
		<AdminLayout>
			<div className="min-h-screen bg-background">
				{/* Main Content */}
				<main className="mx-auto space-y-8 px-6 py-8">
					{" "}
					{/* Header */}
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col gap-2"
						initial={{ opacity: 0, y: -20 }}
					>
						<h1 className="font-bold text-3xl tracking-tight">
							Admin Dashboard
						</h1>
						<p className="text-muted-foreground">
							Platform operations overview and system health monitoring
						</p>
					</motion.div>
					{/* KPI Cards */}
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
						{kpiData.map((kpi, index) => (
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								initial={{ opacity: 0, y: 20 }}
								key={kpi.title}
								transition={{ duration: 0.4, delay: index * 0.1 }}
							>
								<Card className="group relative overflow-hidden border-border/50 bg-card-gradient shadow-card transition-all duration-300 hover:shadow-elevated">
									<div className="absolute inset-0 bg-amber-500/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
									<CardContent className="p-6">
										<div className="flex items-start justify-between">
											<div className="space-y-1">
												<p className="font-medium text-muted-foreground text-sm">
													{kpi.title}
												</p>
												<p className="number-display font-bold text-3xl tracking-tight">
													{kpi.value}
												</p>
											</div>
											<div className="rounded-xl bg-amber-500/10 p-3 transition-colors group-hover:bg-amber-500/20">
												<kpi.icon className="h-5 w-5 text-amber-500" />
											</div>
										</div>
										<div className="mt-4 flex items-center gap-2">
											<div className="flex items-center gap-1 font-medium text-sm text-success">
												<TrendingUp className="h-4 w-4" />
												{kpi.change}
											</div>
											<span className="text-muted-foreground text-xs">
												{kpi.description}
											</span>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>
					{/* Main Content Grid */}
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
						{/* Transaction Volume Chart */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="lg:col-span-2"
							initial={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.4, delay: 0.4 }}
						>
							<Card className="border-border/50 bg-card-gradient">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Activity className="h-5 w-5 text-amber-500" />
										Transaction Volume (7 Days)
									</CardTitle>
									<CardDescription>
										Daily transaction volume and count
									</CardDescription>
								</CardHeader>
								<CardContent>
									<div className="h-[300px]">
										<ResponsiveContainer height="100%" width="100%">
											<AreaChart data={transactionVolumeData}>
												<defs>
													<linearGradient
														id="volumeGradient"
														x1="0"
														x2="0"
														y1="0"
														y2="1"
													>
														<stop
															offset="5%"
															stopColor="hsl(38, 92%, 50%)"
															stopOpacity={0.3}
														/>
														<stop
															offset="95%"
															stopColor="hsl(38, 92%, 50%)"
															stopOpacity={0}
														/>
													</linearGradient>
												</defs>
												<CartesianGrid
													stroke="hsl(217, 33%, 20%)"
													strokeDasharray="3 3"
												/>
												<XAxis
													dataKey="date"
													fontSize={12}
													stroke="hsl(215, 20%, 55%)"
												/>
												<YAxis
													fontSize={12}
													stroke="hsl(215, 20%, 55%)"
													tickFormatter={(value) =>
														`$${(value / 1_000_000).toFixed(1)}M`
													}
												/>
												<Tooltip
													contentStyle={{
														backgroundColor: "hsl(222, 47%, 13%)",
														border: "1px solid hsl(217, 33%, 20%)",
														borderRadius: "8px",
													}}
													formatter={(value: number) => [
														`$${(value / 1_000_000).toFixed(2)}M`,
														"Volume",
													]}
												/>
												<Area
													dataKey="volume"
													fill="url(#volumeGradient)"
													stroke="hsl(38, 92%, 50%)"
													strokeWidth={2}
													type="monotone"
												/>
											</AreaChart>
										</ResponsiveContainer>
									</div>
								</CardContent>
							</Card>
						</motion.div>

						{/* Pending Alerts */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.4, delay: 0.5 }}
						>
							<Card className="h-full border-border/50 bg-card-gradient">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<AlertTriangle className="h-5 w-5 text-amber-500" />
										Pending Alerts
									</CardTitle>
									<CardDescription>
										Requires immediate attention
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{pendingAlerts.map((alert) => (
										<div
											className="flex cursor-pointer items-start gap-3 rounded-lg bg-muted/30 p-3 transition-colors hover:bg-muted/50"
											key={alert.id}
										>
											<div
												className={`mt-0.5 h-2 w-2 shrink-0 rounded-full ${
													alert.priority === "high"
														? "bg-destructive"
														: alert.priority === "medium"
															? "bg-warning"
															: "bg-muted-foreground"
												}`}
											/>
											<div className="min-w-0 flex-1">
												<p className="font-medium text-sm">{alert.message}</p>
												<Badge className="mt-1 text-xs" variant="outline">
													{alert.type}
												</Badge>
											</div>
										</div>
									))}
								</CardContent>
							</Card>
						</motion.div>
					</div>
					{/* System Health & Recent Activity */}
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
						{/* System Health */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.4, delay: 0.6 }}
						>
							<Card className="border-border/50 bg-card-gradient">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Server className="h-5 w-5 text-amber-500" />
										System Health
									</CardTitle>
									<CardDescription>
										Infrastructure status and uptime
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{systemHealth.map((system) => (
										<div className="flex items-center gap-4" key={system.name}>
											<div className="rounded-lg bg-muted/50 p-2">
												<system.icon className="h-4 w-4 text-muted-foreground" />
											</div>
											<div className="flex-1">
												<div className="mb-1 flex items-center justify-between">
													<span className="font-medium text-sm">
														{system.name}
													</span>
													<div className="flex items-center gap-2">
														<span className="text-muted-foreground text-xs">
															{system.uptime}%
														</span>
														<Badge
															className={`text-xs ${
																system.status === "operational"
																	? "border-success/50 text-success"
																	: "border-warning/50 text-warning"
															}`}
															variant="outline"
														>
															{system.status === "operational" ? (
																<CheckCircle className="mr-1 h-3 w-3" />
															) : (
																<Clock className="mr-1 h-3 w-3" />
															)}
															{system.status}
														</Badge>
													</div>
												</div>
												<Progress className="h-1.5" value={system.uptime} />
											</div>
										</div>
									))}
								</CardContent>
							</Card>
						</motion.div>

						{/* Recent Activity */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: 20 }}
							transition={{ duration: 0.4, delay: 0.7 }}
						>
							<Card className="border-border/50 bg-card-gradient">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Activity className="h-5 w-5 text-amber-500" />
										Recent Activity
									</CardTitle>
									<CardDescription>
										Latest admin actions and events
									</CardDescription>
								</CardHeader>
								<CardContent className="space-y-4">
									{recentActivity.map((activity) => (
										<div
											className="flex items-center gap-3 rounded-lg bg-muted/30 p-3"
											key={activity.id}
										>
											<div
												className={`h-2 w-2 shrink-0 rounded-full ${
													activity.type === "success"
														? "bg-success"
														: activity.type === "warning"
															? "bg-warning"
															: activity.type === "danger"
																? "bg-destructive"
																: "bg-primary"
												}`}
											/>
											<div className="min-w-0 flex-1">
												<p className="font-medium text-sm">{activity.action}</p>
												<p className="truncate text-muted-foreground text-xs">
													{activity.user}
												</p>
											</div>
											<span className="whitespace-nowrap text-muted-foreground text-xs">
												{activity.time}
											</span>
										</div>
									))}
								</CardContent>
							</Card>
						</motion.div>
					</div>
					{/* Quick Stats Bar Chart */}
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.4, delay: 0.8 }}
					>
						<Card className="border-border/50 bg-card-gradient">
							<CardHeader>
								<CardTitle>Daily Transaction Count</CardTitle>
								<CardDescription>
									Number of transactions processed per day
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="h-[200px]">
									<ResponsiveContainer height="100%" width="100%">
										<BarChart data={transactionVolumeData}>
											<CartesianGrid
												stroke="hsl(217, 33%, 20%)"
												strokeDasharray="3 3"
											/>
											<XAxis
												dataKey="date"
												fontSize={12}
												stroke="hsl(215, 20%, 55%)"
											/>
											<YAxis fontSize={12} stroke="hsl(215, 20%, 55%)" />
											<Tooltip
												contentStyle={{
													backgroundColor: "hsl(222, 47%, 13%)",
													border: "1px solid hsl(217, 33%, 20%)",
													borderRadius: "8px",
												}}
											/>
											<Bar
												dataKey="transactions"
												fill="hsl(160, 84%, 39%)"
												radius={[4, 4, 0, 0]}
											/>
										</BarChart>
									</ResponsiveContainer>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</main>
			</div>
		</AdminLayout>
	);
}
