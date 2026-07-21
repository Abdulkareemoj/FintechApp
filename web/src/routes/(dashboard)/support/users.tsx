import { createFileRoute } from "@tanstack/react-router";
import {
	AlertTriangle,
	Mail,
	Phone,
	Search,
	Shield,
	UserX,
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
import { Separator } from "@/components/ui/separator";
import SupportLayout from "@/layout/SupportLayout";

export const Route = createFileRoute("/(dashboard)/support/users")({
	component: SupportUserLookup,
});

interface UserProfile {
	id: string;
	name: string;
	email: string;
	phone: string;
	status: "active" | "suspended" | "locked" | "pending";
	kycLevel: 0 | 1 | 2 | 3;
	joined: string;
	totalTransactions: number;
	totalVolume: string;
	recentFlag: string | null;
}

const mockUsers: UserProfile[] = [
	{
		id: "USR-1001",
		name: "John Doe",
		email: "john.doe@email.com",
		phone: "+1 (555) 123-4567",
		status: "active",
		kycLevel: 3,
		joined: "Jan 15, 2024",
		totalTransactions: 847,
		totalVolume: "$124,500",
		recentFlag: null,
	},
	{
		id: "USR-1002",
		name: "Sarah Smith",
		email: "sarah.smith@email.com",
		phone: "+1 (555) 234-5678",
		status: "active",
		kycLevel: 2,
		joined: "Mar 3, 2024",
		totalTransactions: 423,
		totalVolume: "$67,200",
		recentFlag: null,
	},
	{
		id: "USR-1003",
		name: "Mike Johnson",
		email: "mike.johnson@email.com",
		phone: "+1 (555) 345-6789",
		status: "suspended",
		kycLevel: 1,
		joined: "Aug 20, 2024",
		totalTransactions: 56,
		totalVolume: "$12,300",
		recentFlag: "Suspicious login from new device",
	},
	{
		id: "USR-1004",
		name: "Emily Davis",
		email: "emily.davis@email.com",
		phone: "+1 (555) 456-7890",
		status: "locked",
		kycLevel: 2,
		joined: "Nov 11, 2024",
		totalTransactions: 12,
		totalVolume: "$3,400",
		recentFlag: "Multiple failed PIN attempts",
	},
	{
		id: "USR-1005",
		name: "Robert Wilson",
		email: "robert.wilson@email.com",
		phone: "+1 (555) 567-8901",
		status: "active",
		kycLevel: 3,
		joined: "Feb 28, 2024",
		totalTransactions: 1_234,
		totalVolume: "$345,000",
		recentFlag: null,
	},
	{
		id: "USR-1006",
		name: "Lisa Brown",
		email: "lisa.brown@email.com",
		phone: "+1 (555) 678-9012",
		status: "pending",
		kycLevel: 0,
		joined: "Mar 14, 2026",
		totalTransactions: 0,
		totalVolume: "$0",
		recentFlag: "KYC verification pending",
	},
	{
		id: "USR-1007",
		name: "David Chen",
		email: "david.chen@email.com",
		phone: "+1 (555) 789-0123",
		status: "active",
		kycLevel: 2,
		joined: "Oct 5, 2024",
		totalTransactions: 312,
		totalVolume: "$89,000",
		recentFlag: null,
	},
];

const statusConfig: Record<
	string,
	{ label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
	active: { label: "Active", variant: "default" },
	suspended: { label: "Suspended", variant: "destructive" },
	locked: { label: "Locked", variant: "destructive" },
	pending: { label: "Pending", variant: "secondary" },
};

function SupportUserLookup() {
	const [search, setSearch] = useState("");
	const [selectedUser, setSelectedUser] = useState<UserProfile | null>(null);

	const filtered = mockUsers.filter(
		(u) =>
			search === "" ||
			u.name.toLowerCase().includes(search.toLowerCase()) ||
			u.email.toLowerCase().includes(search.toLowerCase()) ||
			u.id.toLowerCase().includes(search.toLowerCase()),
	);

	return (
		<SupportLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-8 px-6 py-8">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<div className="mb-8">
							<h1 className="font-bold text-3xl text-foreground tracking-tight">
								User Lookup
							</h1>
							<p className="mt-1 text-muted-foreground">
								Search and review user profiles, account status, and activity.
							</p>
						</div>

						{/* Search */}
						<div className="relative mb-6 max-w-md">
							<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 text-muted-foreground" />
							<Input
								className="pl-10"
								placeholder="Search by name, email, or user ID..."
								value={search}
								onChange={(e) => setSearch(e.target.value)}
							/>
						</div>

						<div className="grid gap-6 lg:grid-cols-3">
							{/* User List */}
							<div className="lg:col-span-2">
								<Card>
									<CardHeader className="pb-3">
										<CardTitle>Users</CardTitle>
										<CardDescription>
											{filtered.length} matching users
										</CardDescription>
									</CardHeader>
									<CardContent className="p-0">
										<div className="divide-y">
											{filtered.map((user) => (
												<button
													key={user.id}
													type="button"
													onClick={() => setSelectedUser(user)}
													className={`flex w-full items-center gap-4 px-6 py-3 text-left transition-colors hover:bg-muted/50 ${
														selectedUser?.id === user.id ? "bg-muted" : ""
													}`}
												>
													<Avatar>
														<AvatarFallback>
															{user.name
																.split(" ")
																.map((n) => n[0])
																.join("")}
														</AvatarFallback>
													</Avatar>
													<div className="min-w-0 flex-1">
														<div className="font-medium">{user.name}</div>
														<div className="text-xs text-muted-foreground">
															{user.email}
														</div>
													</div>
													<Badge variant={statusConfig[user.status].variant}>
														{statusConfig[user.status].label}
													</Badge>
												</button>
											))}
										</div>
									</CardContent>
								</Card>
							</div>

							{/* User Detail */}
							<div>
								{selectedUser ? (
									<Card>
										<CardHeader className="pb-4">
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10">
													<AvatarFallback>
														{selectedUser.name
															.split(" ")
															.map((n) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div>
													<CardTitle className="text-base">
														{selectedUser.name}
													</CardTitle>
													<CardDescription>{selectedUser.id}</CardDescription>
												</div>
											</div>
										</CardHeader>
										<Separator />
										<CardContent className="space-y-4 pt-4 text-sm">
											<div className="flex items-center gap-2">
												<Mail className="h-4 w-4 text-muted-foreground" />
												<span>{selectedUser.email}</span>
											</div>
											<div className="flex items-center gap-2">
												<Phone className="h-4 w-4 text-muted-foreground" />
												<span>{selectedUser.phone}</span>
											</div>
											<Separator />
											<div className="space-y-1">
												<div className="flex justify-between">
													<span className="text-muted-foreground">Status</span>
													<Badge
														variant={statusConfig[selectedUser.status].variant}
													>
														{statusConfig[selectedUser.status].label}
													</Badge>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">KYC Level</span>
													<span>{selectedUser.kycLevel}/3</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">Joined</span>
													<span>{selectedUser.joined}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">
														Transactions
													</span>
													<span>{selectedUser.totalTransactions}</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">Volume</span>
													<span>{selectedUser.totalVolume}</span>
												</div>
											</div>
											{selectedUser.recentFlag && (
												<>
													<Separator />
													<div className="flex items-start gap-2 rounded-lg bg-destructive/5 p-2 text-xs">
														<AlertTriangle className="mt-0.5 h-3 w-3 shrink-0 text-destructive" />
														<span className="text-destructive">
															{selectedUser.recentFlag}
														</span>
													</div>
												</>
											)}
											<Separator />
											<div className="flex gap-2">
												<Button size="sm" variant="outline" className="flex-1 gap-2">
													<Mail className="h-3 w-3" />
													Email
												</Button>
												<Button size="sm" variant="outline" className="flex-1 gap-2">
													<Shield className="h-3 w-3" />
													Actions
												</Button>
											</div>
										</CardContent>
									</Card>
								) : (
									<Card>
										<CardContent className="flex flex-col items-center justify-center py-16">
											<UserX className="mb-3 h-10 w-10 text-muted-foreground/40" />
											<p className="text-sm text-muted-foreground">
												Select a user to view details
											</p>
										</CardContent>
									</Card>
								)}
							</div>
						</div>
					</motion.div>
				</main>
			</div>
		</SupportLayout>
	);
}
