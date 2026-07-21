import { createFileRoute } from "@tanstack/react-router";
import {
	AlertTriangle,
	BarChart3,
	CheckCircle2,
	Clock,
	Headphones,
	Mail,
	MessageSquare,
	Phone,
	Ticket,
	TrendingUp,
	Users,
} from "lucide-react";
import { motion } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import SupportLayout from "@/layout/SupportLayout";

const recentTickets = [
	{
		id: "TKT-001",
		user: "John Doe",
		subject: "Payment not received",
		priority: "high",
		status: "open",
		time: "5 min ago",
		category: "Payments",
	},
	{
		id: "TKT-002",
		user: "Sarah Smith",
		subject: "Account verification issue",
		priority: "medium",
		status: "in-progress",
		time: "15 min ago",
		category: "Account",
	},
	{
		id: "TKT-003",
		user: "Mike Johnson",
		subject: "Card declined",
		priority: "high",
		status: "resolved",
		time: "1 hour ago",
		category: "Cards",
	},
];

const quickStats = [
	{
		label: "Open Tickets",
		value: "24",
		icon: Ticket,
		color: "blue",
		change: "+12%",
	},
	{
		label: "Avg Response Time",
		value: "2.3 min",
		icon: Clock,
		color: "green",
		change: "-18%",
	},
	{
		label: "Customer Satisfaction",
		value: "94%",
		icon: TrendingUp,
		color: "emerald",
		change: "+3%",
	},
	{
		label: "Resolved Today",
		value: "47",
		icon: CheckCircle2,
		color: "violet",
		change: "+8%",
	},
];

export const Route = createFileRoute("/(dashboard)/support/overview")({
	component: SupportOverview,
});

function SupportOverview() {
	return (
		<SupportLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-8 px-6 py-8">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<h1 className="text-3xl font-bold tracking-tight">
							Support Dashboard
						</h1>
						<p className="text-muted-foreground mt-1">
							Manage customer support tickets and provide excellent service.
						</p>
					</motion.div>

					{/* Quick Stats */}
					<div className="grid gap-4 md:grid-cols-4">
						{quickStats.map((stat, index) => (
							<motion.div
								key={stat.label}
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 + index * 0.05 }}
							>
								<Card className="bg-card/50 backdrop-blur-sm border-border/50">
									<CardContent className="p-4">
										<div className="flex items-center justify-between">
											<div>
												<p className="text-sm text-muted-foreground">
													{stat.label}
												</p>
												<p className="text-2xl font-bold">{stat.value}</p>
												<p className="text-xs text-emerald-400 mt-1">
													{stat.change}
												</p>
											</div>
											<div
												className={`h-12 w-12 rounded-lg bg-${stat.color}-500/10 flex items-center justify-center`}
											>
												<stat.icon
													className={`h-6 w-6 text-${stat.color}-400`}
												/>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						))}
					</div>

					{/* Quick Actions */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<Card className="bg-card/50 backdrop-blur-sm border-border/50">
							<CardHeader>
								<CardTitle className="text-lg font-semibold">
									Quick Actions
								</CardTitle>
								<CardDescription>
									Common support tasks and tools
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 md:grid-cols-4">
									<Button className="h-20 flex-col gap-2 bg-primary hover:bg-primary/90">
										<Users className="h-6 w-6" />
										<span>User Lookup</span>
									</Button>
									<Button variant="outline" className="h-20 flex-col gap-2">
										<Ticket className="h-6 w-6" />
										<span>New Ticket</span>
									</Button>
									<Button variant="outline" className="h-20 flex-col gap-2">
										<MessageSquare className="h-6 w-6" />
										<span>Live Chat</span>
									</Button>
									<Button variant="outline" className="h-20 flex-col gap-2">
										<BarChart3 className="h-6 w-6" />
										<span>Reports</span>
									</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Recent Tickets */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<Card className="bg-card/50 backdrop-blur-sm border-border/50">
							<CardHeader className="flex flex-row items-center justify-between">
								<div>
									<CardTitle className="text-lg font-semibold">
										Recent Tickets
									</CardTitle>
									<CardDescription>
										Latest customer support requests
									</CardDescription>
								</div>
								<Button variant="outline" size="sm">
									View All
								</Button>
							</CardHeader>
							<CardContent>
								<div className="space-y-4">
									{recentTickets.map((ticket) => (
										<div
											key={ticket.id}
											className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20"
										>
											<div className="flex items-center gap-4">
												<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
													<Ticket className="h-5 w-5 text-primary" />
												</div>
												<div>
													<div className="flex items-center gap-2">
														<span className="font-medium">
															{ticket.subject}
														</span>
														<Badge variant="outline" className="text-xs">
															{ticket.category}
														</Badge>
													</div>
													<div className="flex items-center gap-2 mt-1">
														<span className="text-sm text-muted-foreground">
															{ticket.user} • {ticket.id}
														</span>
														<span className="text-xs text-muted-foreground">
															•
														</span>
														<span className="text-xs text-muted-foreground">
															{ticket.time}
														</span>
													</div>
												</div>
											</div>
											<div className="flex items-center gap-2">
												<Badge
													variant={
														ticket.priority === "high"
															? "destructive"
															: "secondary"
													}
													className="text-xs"
												>
													{ticket.priority}
												</Badge>
												<Badge
													variant={
														ticket.status === "open"
															? "destructive"
															: ticket.status === "in-progress"
																? "default"
																: "secondary"
													}
													className="text-xs"
												>
													{ticket.status}
												</Badge>
											</div>
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Support Channels */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.5 }}
					>
						<Card className="bg-card/50 backdrop-blur-sm border-border/50">
							<CardHeader>
								<CardTitle className="text-lg font-semibold">
									Support Channels
								</CardTitle>
								<CardDescription>
									Customer communication channels and status
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 md:grid-cols-3">
									<div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-muted/20">
										<div className="h-10 w-10 rounded-lg bg-emerald-500/10 flex items-center justify-center">
											<Mail className="h-5 w-5 text-emerald-400" />
										</div>
										<div>
											<p className="font-medium">Email Support</p>
											<p className="text-sm text-muted-foreground">
												12 active conversations
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-muted/20">
										<div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
											<MessageSquare className="h-5 w-5 text-blue-400" />
										</div>
										<div>
											<p className="font-medium">Live Chat</p>
											<p className="text-sm text-muted-foreground">
												8 active chats
											</p>
										</div>
									</div>
									<div className="flex items-center gap-3 p-4 rounded-lg border border-border/50 bg-muted/20">
										<div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
											<Phone className="h-5 w-5 text-primary" />
										</div>
										<div>
											<p className="font-medium">Phone Support</p>
											<p className="text-sm text-muted-foreground">
												3 calls in queue
											</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</main>
			</div>
		</SupportLayout>
	);
}
