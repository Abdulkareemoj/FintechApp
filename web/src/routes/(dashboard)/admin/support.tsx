import { createFileRoute } from "@tanstack/react-router";
import {
	MessageSquare,
	MoreHorizontal,
	Search,
	Send,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AdminLayout from "@/layout/AdminLayout";

export const Route = createFileRoute("/(dashboard)/admin/support")({
	component: AdminSupport,
});

interface Ticket {
	id: string;
	user: string;
	email: string;
	subject: string;
	category: string;
	priority: "low" | "medium" | "high" | "urgent";
	status: "open" | "in-progress" | "resolved" | "closed";
	createdAt: string;
	lastActivity: string;
	assignedTo?: string;
}

const mockTickets: Ticket[] = [
	{
		id: "TKT-1001",
		user: "John Doe",
		email: "john@email.com",
		subject: "Unauthorized transaction dispute",
		category: "Fraud",
		priority: "urgent",
		status: "open",
		createdAt: "2026-03-15T09:30:00Z",
		lastActivity: "2026-03-15T09:30:00Z",
	},
	{
		id: "TKT-1002",
		user: "Sarah Smith",
		email: "sarah@email.com",
		subject: "Card not delivered after 2 weeks",
		category: "Cards",
		priority: "high",
		status: "in-progress",
		createdAt: "2026-03-14T14:20:00Z",
		lastActivity: "2026-03-15T08:00:00Z",
		assignedTo: "You",
	},
	{
		id: "TKT-1003",
		user: "Mike Johnson",
		email: "mike@email.com",
		subject: "International transfer taking too long",
		category: "Transfers",
		priority: "high",
		status: "in-progress",
		createdAt: "2026-03-14T11:45:00Z",
		lastActivity: "2026-03-14T16:30:00Z",
		assignedTo: "Support Team",
	},
	{
		id: "TKT-1004",
		user: "Emily Davis",
		email: "emily@email.com",
		subject: "How to set up recurring payments?",
		category: "Account",
		priority: "low",
		status: "resolved",
		createdAt: "2026-03-13T10:00:00Z",
		lastActivity: "2026-03-14T09:15:00Z",
		assignedTo: "Support Team",
	},
	{
		id: "TKT-1005",
		user: "Robert Wilson",
		email: "robert@email.com",
		subject: "Account locked after password reset",
		category: "Security",
		priority: "urgent",
		status: "open",
		createdAt: "2026-03-15T07:15:00Z",
		lastActivity: "2026-03-15T07:15:00Z",
	},
	{
		id: "TKT-1006",
		user: "Lisa Brown",
		email: "lisa@email.com",
		subject: "Bill payment failed but amount deducted",
		category: "Payments",
		priority: "medium",
		status: "open",
		createdAt: "2026-03-14T22:30:00Z",
		lastActivity: "2026-03-14T22:30:00Z",
	},
	{
		id: "TKT-1007",
		user: "David Chen",
		email: "david@email.com",
		subject: "Increase daily transfer limit",
		category: "Account",
		priority: "medium",
		status: "closed",
		createdAt: "2026-03-12T16:00:00Z",
		lastActivity: "2026-03-13T11:45:00Z",
		assignedTo: "You",
	},
];

const priorityColors: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
	low: "secondary",
	medium: "default",
	high: "destructive",
	urgent: "destructive",
};

const statusColors: Record<string, "default" | "secondary" | "outline"> = {
	open: "default",
	"in-progress": "secondary",
	resolved: "outline",
	closed: "outline",
};

function AdminSupport() {
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
	const [replyText, setReplyText] = useState("");

	const filtered = mockTickets.filter((t) => {
		const matchesSearch =
			search === "" ||
			t.subject.toLowerCase().includes(search.toLowerCase()) ||
			t.user.toLowerCase().includes(search.toLowerCase()) ||
			t.id.toLowerCase().includes(search.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || t.status === statusFilter;
		return matchesSearch && matchesStatus;
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
								Support Center
							</h1>
							<p className="mt-1 text-muted-foreground">
								Manage support tickets, respond to users, and track resolution
								metrics.
							</p>
						</div>

						{/* Stats Cards */}
						<div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Open Tickets
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">3</div>
									<p className="mt-1 text-xs text-muted-foreground">
										Needs attention
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										In Progress
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl text-primary">2</div>
									<p className="mt-1 text-xs text-muted-foreground">
										Being handled
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Resolved Today
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl text-emerald-500">5</div>
									<p className="mt-1 text-xs text-muted-foreground">
										+2 from yesterday
									</p>
								</CardContent>
							</Card>
							<Card>
								<CardHeader className="pb-2">
									<CardTitle className="text-sm font-medium text-muted-foreground">
										Avg Response Time
									</CardTitle>
								</CardHeader>
								<CardContent>
									<div className="font-bold text-2xl">4.2m</div>
									<p className="mt-1 text-xs text-muted-foreground">
										Within SLA target
									</p>
								</CardContent>
							</Card>
						</div>

						<div className="grid gap-6 lg:grid-cols-3">
							{/* Ticket List */}
							<div className="lg:col-span-2">
								<Card>
									<CardHeader className="pb-3">
										<div className="flex items-center justify-between">
											<div>
												<CardTitle>Support Tickets</CardTitle>
												<CardDescription>
													{filtered.length} tickets match your filters
												</CardDescription>
											</div>
											<div className="flex items-center gap-2">
												<div className="relative">
													<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
													<Input
														className="h-9 w-[200px] pl-9"
														placeholder="Search tickets..."
														value={search}
														onChange={(e) => setSearch(e.target.value)}
													/>
												</div>
												<Select
													value={statusFilter}
													onValueChange={setStatusFilter}
												>
													<SelectTrigger className="h-9 w-[130px]">
														<SelectValue placeholder="Status" />
													</SelectTrigger>
													<SelectContent>
														<SelectItem value="all">All Status</SelectItem>
														<SelectItem value="open">Open</SelectItem>
														<SelectItem value="in-progress">
															In Progress
														</SelectItem>
														<SelectItem value="resolved">Resolved</SelectItem>
														<SelectItem value="closed">Closed</SelectItem>
													</SelectContent>
												</Select>
											</div>
										</div>
									</CardHeader>
									<CardContent className="p-0">
										<div className="divide-y">
											{filtered.map((ticket) => (
												<button
													key={ticket.id}
													type="button"
													onClick={() => setSelectedTicket(ticket)}
													className={`flex w-full items-start gap-4 px-6 py-4 text-left transition-colors hover:bg-muted/50 ${
														selectedTicket?.id === ticket.id
															? "bg-muted"
															: ""
													}`}
												>
													<Avatar className="mt-0.5 h-9 w-9">
														<AvatarFallback className="text-xs">
															{ticket.user
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
													<div className="min-w-0 flex-1">
														<div className="flex items-center justify-between gap-2">
															<span className="truncate font-medium">
																{ticket.subject}
															</span>
															<Badge
																variant={priorityColors[ticket.priority]}
																className="shrink-0 text-[10px]"
															>
																{ticket.priority}
															</Badge>
														</div>
														<div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
															<span>{ticket.user}</span>
															<span>·</span>
															<span>{ticket.category}</span>
															<span>·</span>
															<span>{ticket.id}</span>
														</div>
														<div className="mt-1 flex items-center gap-2">
															<Badge
																variant={statusColors[ticket.status]}
																className="text-[10px]"
															>
																{ticket.status}
															</Badge>
															<span className="text-[11px] text-muted-foreground">
																{new Date(
																	ticket.lastActivity,
																).toLocaleString()}
															</span>
														</div>
													</div>
												</button>
											))}
										</div>
									</CardContent>
								</Card>
							</div>

							{/* Ticket Detail */}
							<div className="lg:col-span-1">
								<Card className="h-full">
									{selectedTicket ? (
										<>
											<CardHeader className="pb-3">
												<div className="flex items-start justify-between">
													<div>
														<CardTitle className="text-base">
															{selectedTicket.subject}
														</CardTitle>
														<CardDescription className="mt-1">
															{selectedTicket.id} ·{" "}
															{selectedTicket.category}
														</CardDescription>
													</div>
												</div>
												<div className="mt-2 flex items-center gap-2">
													<Avatar className="h-6 w-6">
														<AvatarFallback className="text-[10px]">
															{selectedTicket.user
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
													<span className="text-sm">{selectedTicket.user}</span>
													<Badge
														variant={priorityColors[selectedTicket.priority]}
														className="text-[10px]"
													>
														{selectedTicket.priority}
													</Badge>
												</div>
											</CardHeader>
											<Separator />
											<CardContent className="space-y-4 pt-4">
												<div className="rounded-lg bg-muted/50 p-3">
													<p className="text-sm text-muted-foreground">
														Customer is reporting an issue with their account
														that requires immediate attention. Please review
														and provide a resolution.
													</p>
												</div>
												<div className="space-y-2">
													<Label htmlFor="reply">Reply to ticket</Label>
													<Textarea
														id="reply"
														placeholder="Type your response..."
														value={replyText}
														onChange={(e) => setReplyText(e.target.value)}
													/>
												</div>
												<div className="flex gap-2">
													<Button className="flex-1 gap-2">
														<Send className="h-4 w-4" />
														Send Reply
													</Button>
													<Button variant="outline" size="icon">
														<MoreHorizontal className="h-4 w-4" />
													</Button>
												</div>
												<div className="flex gap-2">
													<Select defaultValue="in-progress">
														<SelectTrigger className="flex-1">
															<SelectValue placeholder="Update Status" />
														</SelectTrigger>
														<SelectContent>
															<SelectItem value="open">Mark Open</SelectItem>
															<SelectItem value="in-progress">
																In Progress
															</SelectItem>
															<SelectItem value="resolved">
																Resolved
															</SelectItem>
															<SelectItem value="closed">Closed</SelectItem>
														</SelectContent>
													</Select>
												</div>
											</CardContent>
										</>
									) : (
										<CardContent className="flex flex-col items-center justify-center py-16">
											<MessageSquare className="mb-3 h-10 w-10 text-muted-foreground/40" />
											<p className="text-sm text-muted-foreground">
												Select a ticket to view details
											</p>
										</CardContent>
									)}
								</Card>
							</div>
						</div>
					</motion.div>
				</main>
			</div>
		</AdminLayout>
	);
}
