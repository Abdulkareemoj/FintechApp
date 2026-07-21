import { createFileRoute } from "@tanstack/react-router";
import {
	AlertTriangle,
	Calendar,
	CheckCircle2,
	Clock,
	Download,
	Eye,
	FileText,
	Filter,
	Mail,
	Search,
	User,
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

const statementRequests = [
	{
		id: "REQ-001",
		user: "John Doe",
		email: "john@example.com",
		type: "Monthly Statement",
		period: "January 2024",
		status: "completed",
		requestedDate: "2024-01-20",
		completedDate: "2024-01-20",
		priority: "normal",
	},
	{
		id: "REQ-002",
		user: "Sarah Smith",
		email: "sarah@example.com",
		type: "Transaction History",
		period: "Last 6 months",
		status: "processing",
		requestedDate: "2024-01-19",
		completedDate: null,
		priority: "high",
	},
	{
		id: "REQ-003",
		user: "Mike Johnson",
		email: "mike@example.com",
		type: "Tax Document",
		period: "2023 Tax Year",
		status: "pending",
		requestedDate: "2024-01-18",
		completedDate: null,
		priority: "normal",
	},
	{
		id: "REQ-004",
		user: "Emily Davis",
		email: "emily@example.com",
		type: "Account Statement",
		period: "Q4 2023",
		status: "completed",
		requestedDate: "2024-01-17",
		completedDate: "2024-01-18",
		priority: "high",
	},
];

const stats = [
	{ label: "Total Requests", value: "156", icon: FileText, color: "blue" },
	{
		label: "Completed Today",
		value: "23",
		icon: CheckCircle2,
		color: "emerald",
	},
	{ label: "Processing", value: "8", icon: Clock, color: "amber" },
	{ label: "High Priority", value: "3", icon: AlertTriangle, color: "red" },
];

export const Route = createFileRoute("/(dashboard)/support/statements")({
	component: SupportStatements,
});

function SupportStatements() {
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
							Statement Requests
						</h1>
						<p className="text-muted-foreground mt-1">
							Manage customer requests for financial statements and documents.
						</p>
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

					{/* Quick Actions */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
					>
						<Card className="bg-card/50 backdrop-blur-sm border-border/50">
							<CardHeader>
								<CardTitle className="text-lg font-semibold">
									Quick Actions
								</CardTitle>
								<CardDescription>
									Common statement-related tasks
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid gap-4 md:grid-cols-4">
									<Button className="h-20 flex-col gap-2 bg-primary hover:bg-primary/90">
										<FileText className="h-6 w-6" />
										<span>Generate Statement</span>
									</Button>
									<Button variant="outline" className="h-20 flex-col gap-2">
										<Download className="h-6 w-6" />
										<span>Batch Download</span>
									</Button>
									<Button variant="outline" className="h-20 flex-col gap-2">
										<Mail className="h-6 w-6" />
										<span>Email Statements</span>
									</Button>
									<Button variant="outline" className="h-20 flex-col gap-2">
										<Calendar className="h-6 w-6" />
										<span>Schedule Reports</span>
									</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Filters */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<Card className="bg-card/50 backdrop-blur-sm border-border/50">
							<CardContent className="p-4">
								<div className="flex flex-wrap gap-4 items-center">
									<div className="flex-1 min-w-64">
										<div className="relative">
											<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
											<Input
												placeholder="Search by user, email, or request ID..."
												className="pl-10 bg-muted/50"
											/>
										</div>
									</div>
									<Select>
										<SelectTrigger className="w-40">
											<SelectValue placeholder="Type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Types</SelectItem>
											<SelectItem value="monthly">Monthly Statement</SelectItem>
											<SelectItem value="transaction">
												Transaction History
											</SelectItem>
											<SelectItem value="tax">Tax Document</SelectItem>
											<SelectItem value="account">Account Statement</SelectItem>
										</SelectContent>
									</Select>
									<Select>
										<SelectTrigger className="w-40">
											<SelectValue placeholder="Status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Status</SelectItem>
											<SelectItem value="pending">Pending</SelectItem>
											<SelectItem value="processing">Processing</SelectItem>
											<SelectItem value="completed">Completed</SelectItem>
										</SelectContent>
									</Select>
									<Button variant="outline" size="sm">
										<Calendar className="h-4 w-4 mr-2" />
										Date Range
									</Button>
									<Button variant="outline" size="sm">
										<Download className="h-4 w-4 mr-2" />
										Export
									</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Statement Requests Table */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<Card className="bg-card/50 backdrop-blur-sm border-border/50">
							<CardHeader>
								<CardTitle className="text-lg font-semibold">
									Statement Requests
								</CardTitle>
								<CardDescription>
									Customer document requests and processing status
								</CardDescription>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow>
											<TableHead>Request ID</TableHead>
											<TableHead>Customer</TableHead>
											<TableHead>Document Type</TableHead>
											<TableHead>Period</TableHead>
											<TableHead>Status</TableHead>
											<TableHead>Priority</TableHead>
											<TableHead>Requested</TableHead>
											<TableHead>Completed</TableHead>
											<TableHead>Actions</TableHead>
										</TableRow>
									</TableHeader>
									<TableBody>
										{statementRequests.map((request) => (
											<TableRow key={request.id}>
												<TableCell className="font-mono text-sm">
													{request.id}
												</TableCell>
												<TableCell>
													<div>
														<div className="font-medium">{request.user}</div>
														<div className="text-sm text-muted-foreground">
															{request.email}
														</div>
													</div>
												</TableCell>
												<TableCell>
													<Badge variant="outline">{request.type}</Badge>
												</TableCell>
												<TableCell className="font-medium">
													{request.period}
												</TableCell>
												<TableCell>
													<Badge
														variant={
															request.status === "completed"
																? "default"
																: request.status === "processing"
																	? "secondary"
																	: "outline"
														}
													>
														{request.status}
													</Badge>
												</TableCell>
												<TableCell>
													<Badge
														variant={
															request.priority === "high"
																? "destructive"
																: "secondary"
														}
													>
														{request.priority}
													</Badge>
												</TableCell>
												<TableCell>{request.requestedDate}</TableCell>
												<TableCell>
													{request.completedDate || (
														<span className="text-muted-foreground">-</span>
													)}
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
															<Download className="h-4 w-4" />
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
