import { createFileRoute } from "@tanstack/react-router";
import {
	AlertTriangle,
	Archive,
	ArrowUpDown,
	Calendar,
	CheckCircle2,
	Clock,
	Eye,
	Filter,
	MessageSquare,
	Paperclip,
	Plus,
	Reply,
	Search,
	User,
} from "lucide-react";
import { motion } from "motion/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import SupportLayout from "@/layout/SupportLayout";

const tickets = [
	{
		id: "TKT-001",
		subject: "Payment not received",
		user: "John Doe",
		email: "john@example.com",
		category: "Payments",
		priority: "high",
		status: "open",
		assignedTo: "Support Agent A",
		createdDate: "2024-01-20 14:30",
		lastActivity: "2024-01-20 15:45",
		messages: 3,
		attachments: 2,
	},
	{
		id: "TKT-002",
		subject: "Account verification issue",
		user: "Sarah Smith",
		email: "sarah@example.com",
		category: "Account",
		priority: "medium",
		status: "in-progress",
		assignedTo: "Support Agent B",
		createdDate: "2024-01-20 12:15",
		lastActivity: "2024-01-20 16:20",
		messages: 7,
		attachments: 1,
	},
	{
		id: "TKT-003",
		subject: "Card declined during purchase",
		user: "Mike Johnson",
		email: "mike@example.com",
		category: "Cards",
		priority: "high",
		status: "resolved",
		assignedTo: "Support Agent C",
		createdDate: "2024-01-19 09:30",
		lastActivity: "2024-01-19 17:45",
		messages: 12,
		attachments: 3,
	},
	{
		id: "TKT-004",
		subject: "Unable to login",
		user: "Emily Davis",
		email: "emily@example.com",
		category: "Technical",
		priority: "medium",
		status: "pending",
		assignedTo: "Unassigned",
		createdDate: "2024-01-19 16:45",
		lastActivity: "2024-01-19 16:45",
		messages: 1,
		attachments: 0,
	},
];

const stats = [
	{ label: "Open Tickets", value: "24", icon: MessageSquare, color: "blue" },
	{ label: "In Progress", value: "18", icon: Clock, color: "amber" },
	{
		label: "Resolved Today",
		value: "47",
		icon: CheckCircle2,
		color: "emerald",
	},
	{ label: "High Priority", value: "5", icon: AlertTriangle, color: "red" },
];

export const Route = createFileRoute("/(dashboard)/support/tickets")({
	component: SupportTickets,
});

function SupportTickets() {
	return (
		<SupportLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-8 px-6 py-8">
					{/* Header */}
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<div className="flex items-center justify-between">
							<div>
								<h1 className="text-3xl font-bold tracking-tight">
									Support Tickets
								</h1>
								<p className="text-muted-foreground mt-1">
									Manage customer support tickets and requests.
								</p>
							</div>
							<Button className="bg-primary hover:bg-primary/90">
								<Plus className="h-4 w-4 mr-2" />
								New Ticket
							</Button>
						</div>
					</motion.div>

					{/* Stats */}
					<div className="grid gap-4 md:grid-cols-4">
						{stats.map((stat, index) => (
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

					{/* Filters */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Card className="bg-card/50 backdrop-blur-sm border-border/50">
							<CardContent className="p-4">
								<div className="flex flex-wrap gap-4 items-center">
									<div className="flex-1 min-w-64">
										<div className="relative">
											<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
											<Input
												placeholder="Search by subject, user, or ticket ID..."
												className="pl-10 bg-muted/50"
											/>
										</div>
									</div>
									<Select>
										<SelectTrigger className="w-40">
											<SelectValue placeholder="Status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Status</SelectItem>
											<SelectItem value="open">Open</SelectItem>
											<SelectItem value="in-progress">In Progress</SelectItem>
											<SelectItem value="pending">Pending</SelectItem>
											<SelectItem value="resolved">Resolved</SelectItem>
										</SelectContent>
									</Select>
									<Select>
										<SelectTrigger className="w-40">
											<SelectValue placeholder="Priority" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Priority</SelectItem>
											<SelectItem value="high">High</SelectItem>
											<SelectItem value="medium">Medium</SelectItem>
											<SelectItem value="low">Low</SelectItem>
										</SelectContent>
									</Select>
									<Select>
										<SelectTrigger className="w-40">
											<SelectValue placeholder="Category" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Categories</SelectItem>
											<SelectItem value="payments">Payments</SelectItem>
											<SelectItem value="account">Account</SelectItem>
											<SelectItem value="cards">Cards</SelectItem>
											<SelectItem value="technical">Technical</SelectItem>
										</SelectContent>
									</Select>
									<Button variant="outline" size="sm">
										<Calendar className="h-4 w-4 mr-2" />
										Date Range
									</Button>
									<Button variant="outline" size="sm">
										<Filter className="h-4 w-4 mr-2" />
										More Filters
									</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Tickets Table */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<Card className="bg-card/50 backdrop-blur-sm border-border/50">
							<CardHeader>
								<CardTitle className="text-lg font-semibold">
									Active Tickets
								</CardTitle>
								<CardDescription>
									Customer support tickets requiring attention
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Ticket ID</TableHead>
											<TableHead>Subject</TableHead>
											<TableHead>Customer</TableHead>
											<TableHead>Category</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Priority</TableHead>
											<TableHead>Assigned To</TableHead>
											<TableHead>Last Activity</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{tickets.map((ticket) => (
											<TableRow key={ticket.id}>
												<TableCell className="font-mono text-sm">
													{ticket.id}
												</TableCell>
												<TableCell>
													<div className="max-w-xs">
														<div className="font-medium truncate">
															{ticket.subject}
														</div>
														<div className="flex items-center gap-2 mt-1">
															{ticket.messages > 0 && (
																<Badge variant="secondary" className="text-xs">
																	<MessageSquare className="h-3 w-3 mr-1" />
																	{ticket.messages}
																</Badge>
															)}
															{ticket.attachments > 0 && (
																<Badge variant="outline" className="text-xs">
																	<Paperclip className="h-3 w-3 mr-1" />
																	{ticket.attachments}
																</Badge>
															)}
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-3">
														<Avatar className="h-8 w-8">
															<AvatarImage src={undefined} />
															<AvatarFallback className="text-xs">
																{ticket.user
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</AvatarFallback>
														</Avatar>
														<div>
															<div className="font-medium">{ticket.user}</div>
															<div className="text-sm text-muted-foreground">
																{ticket.email}
															</div>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<Badge variant="outline">{ticket.category}</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant={
															ticket.status === "open"
																? "destructive"
																: ticket.status === "in-progress"
																	? "default"
																	: ticket.status === "resolved"
																		? "secondary"
																		: "outline"
														}
													>
														{ticket.status}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant={
															ticket.priority === "high"
																? "destructive"
																: ticket.priority === "medium"
																	? "default"
																	: "secondary"
														}
													>
														{ticket.priority}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Avatar className="h-6 w-6">
															<AvatarImage src={undefined} />
															<AvatarFallback className="text-xs">
																{ticket.assignedTo
																	.split(" ")
																	.map((n) => n[0])
																	.join("")}
															</AvatarFallback>
														</Avatar>
														<span className="text-sm">{ticket.assignedTo}</span>
													</div>
												</TableCell>
												<TableCell className="text-sm">
													{ticket.lastActivity}
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
														>
															<Eye className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
														>
															<Reply className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8"
														>
															<Archive className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</motion.div>
				</main>
			</div>
		</SupportLayout>
	);
}
