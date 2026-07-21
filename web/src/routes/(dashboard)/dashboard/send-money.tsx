import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Check,
	Clock,
	DollarSign,
	Mail,
	Phone,
	Send,
	User,
	Users,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/layout/DashboardLayout";

const recentRecipients = [
	{
		id: "1",
		name: "Sarah Wilson",
		email: "sarah@email.com",
		avatar: "https://i.pravatar.cc/100?img=1",
	},
	{
		id: "2",
		name: "Mike Johnson",
		email: "mike@email.com",
		avatar: "https://i.pravatar.cc/100?img=2",
	},
	{
		id: "3",
		name: "Emily Brown",
		email: "emily@email.com",
		avatar: "https://i.pravatar.cc/100?img=3",
	},
	{
		id: "4",
		name: "Alex Chen",
		email: "alex@email.com",
		avatar: "https://i.pravatar.cc/100?img=4",
	},
];

const pendingRequests = [
	{ id: "1", name: "David Lee", amount: 50.0, date: "2024-07-20" },
	{ id: "2", name: "Jessica Park", amount: 125.0, date: "2024-07-19" },
];
export const Route = createFileRoute("/(dashboard)/dashboard/send-money")({
	component: SendMoneyPage,
});

function SendMoneyPage() {
	const [amount, setAmount] = useState("");
	const [recipient, setRecipient] = useState("");

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				{/* Main Content */}
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 10 }}
					>
						<h1 className="font-bold text-3xl tracking-tight">Send Money</h1>
						<p className="mt-1 text-muted-foreground">
							Transfer funds to anyone, anywhere
						</p>
					</motion.div>

					<div className="grid gap-6 lg:grid-cols-3">
						{/* Main Send Form */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="lg:col-span-2"
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.1 }}
						>
							<Card className="border-border/50 bg-card-gradient shadow-card">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Send className="h-5 w-5 text-primary" />
										New Transfer
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<Tabs defaultValue="email">
										<TabsList className="grid w-full grid-cols-3 bg-muted/50">
											<TabsTrigger className="gap-2" value="email">
												<Mail className="h-4 w-4" />
												Email
											</TabsTrigger>
											<TabsTrigger className="gap-2" value="phone">
												<Phone className="h-4 w-4" />
												Phone
											</TabsTrigger>
											<TabsTrigger className="gap-2" value="user">
												<User className="h-4 w-4" />
												Username
											</TabsTrigger>
										</TabsList>

										<TabsContent className="mt-6 space-y-4" value="email">
											<div className="space-y-2">
												<Label htmlFor="email">Recipient Email</Label>
												<Input
													className="bg-muted/50"
													id="email"
													onChange={(e) => setRecipient(e.target.value)}
													placeholder="name@example.com"
													type="email"
													value={recipient}
												/>
											</div>
										</TabsContent>

										<TabsContent className="mt-6 space-y-4" value="phone">
											<div className="space-y-2">
												<Label htmlFor="phone">Phone Number</Label>
												<Input
													className="bg-muted/50"
													id="phone"
													placeholder="+1 (555) 000-0000"
													type="tel"
												/>
											</div>
										</TabsContent>

										<TabsContent className="mt-6 space-y-4" value="user">
											<div className="space-y-2">
												<Label htmlFor="username">FinPay Username</Label>
												<Input
													className="bg-muted/50"
													id="username"
													placeholder="@username"
												/>
											</div>
										</TabsContent>
									</Tabs>

									{/* Amount Input */}
									<div className="space-y-2">
										<Label>Amount</Label>
										<div className="relative">
											<DollarSign className="-translate-y-1/2 absolute top-1/2 left-4 h-6 w-6 text-muted-foreground" />
											<Input
												className="number-display h-16 bg-muted/50 pl-12 font-bold text-3xl"
												onChange={(e) => setAmount(e.target.value)}
												placeholder="0.00"
												type="number"
												value={amount}
											/>
										</div>
										<p className="text-muted-foreground text-sm">
											Available balance: $46,350.75
										</p>
									</div>

									{/* Note */}
									<div className="space-y-2">
										<Label htmlFor="note">Note (Optional)</Label>
										<Input
											className="bg-muted/50"
											id="note"
											placeholder="What's this for?"
										/>
									</div>

									<Button className="w-full bg-primary-gradient" size="lg">
										<Send className="mr-2 h-4 w-4" />
										Send Money
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</CardContent>
							</Card>
						</motion.div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Recent Recipients */}
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								initial={{ opacity: 0, y: 20 }}
								transition={{ delay: 0.2 }}
							>
								<Card className="border-border/50 bg-card-gradient shadow-card">
									<CardHeader className="pb-4">
										<CardTitle className="flex items-center gap-2 text-base">
											<Users className="h-4 w-4 text-primary" />
											Recent Recipients
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{recentRecipients.map((person) => (
											<Button
												className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent/50"
												key={person.id}
											>
												<Avatar className="h-10 w-10">
													<AvatarImage src={person.avatar} />
													<AvatarFallback>{person.name[0]}</AvatarFallback>
												</Avatar>
												<div className="min-w-0 flex-1">
													<p className="truncate font-medium">{person.name}</p>
													<p className="truncate text-muted-foreground text-sm">
														{person.email}
													</p>
												</div>
												<ArrowRight className="h-4 w-4 text-muted-foreground" />
											</Button>
										))}
									</CardContent>
								</Card>
							</motion.div>

							{/* Pending Requests */}
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								initial={{ opacity: 0, y: 20 }}
								transition={{ delay: 0.3 }}
							>
								<Card className="border-border/50 bg-card-gradient shadow-card">
									<CardHeader className="pb-4">
										<CardTitle className="flex items-center gap-2 text-base">
											<Clock className="h-4 w-4 text-warning" />
											Pending Requests
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{pendingRequests.map((request) => (
											<div
												className="flex items-center justify-between rounded-lg bg-accent/30 p-3"
												key={request.id}
											>
												<div>
													<p className="font-medium">{request.name}</p>
													<p className="text-muted-foreground text-sm">
														Requested ${request.amount.toFixed(2)}
													</p>
												</div>
												<div className="flex gap-2">
													<Button size="sm" variant="outline">
														<Check className="h-3 w-3" />
													</Button>
												</div>
											</div>
										))}
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</div>
				</main>
			</div>
		</DashboardLayout>
	);
}
