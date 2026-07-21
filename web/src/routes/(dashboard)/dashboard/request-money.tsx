import { createFileRoute } from "@tanstack/react-router";
import {
	CheckCircle2,
	Clock,
	Copy,
	DollarSign,
	HandCoins,
	Link2,
	Mail,
	Phone,
	QrCode,
	Share2,
	User,
	XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DashboardLayout from "@/layout/DashboardLayout";

export const Route = createFileRoute("/(dashboard)/dashboard/request-money")({
	component: RequestMoneyPage,
});
const pendingRequests = [
	{
		id: "REQ001",
		recipient: "Sarah Wilson",
		email: "sarah@email.com",
		amount: 250.0,
		status: "pending",
		date: "2024-07-20",
		note: "Dinner split",
	},
	{
		id: "REQ002",
		recipient: "Mike Johnson",
		email: "mike@email.com",
		amount: 75.0,
		status: "pending",
		date: "2024-07-19",
		note: "Movie tickets",
	},
	{
		id: "REQ003",
		recipient: "Emily Brown",
		email: "emily@email.com",
		amount: 500.0,
		status: "paid",
		date: "2024-07-17",
		note: "Rent share",
	},
	{
		id: "REQ004",
		recipient: "Alex Chen",
		email: "alex@email.com",
		amount: 30.0,
		status: "declined",
		date: "2024-07-15",
		note: "Lunch",
	},
	{
		id: "REQ005",
		recipient: "David Lee",
		email: "david@email.com",
		amount: 120.0,
		status: "expired",
		date: "2024-07-10",
		note: "Concert tickets",
	},
];

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
	pending: {
		color: "bg-warning/10 text-warning border-warning/20",
		icon: Clock,
	},
	paid: {
		color: "bg-success/10 text-success border-success/20",
		icon: CheckCircle2,
	},
	declined: {
		color: "bg-destructive/10 text-destructive border-destructive/20",
		icon: XCircle,
	},
	expired: {
		color: "bg-muted text-muted-foreground border-border",
		icon: Clock,
	},
};

function RequestMoneyPage() {
	const [amount, setAmount] = useState("");
	const [paymentLink] = useState("https://finpay.app/pay/jd-7x9k2m");

	const totalPending = pendingRequests
		.filter((r) => r.status === "pending")
		.reduce((sum, r) => sum + r.amount, 0);

	const copyLink = () => {
		navigator.clipboard.writeText(paymentLink);
		toast.success("Payment link copied to clipboard");
	};
	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				{/* Main Content */}
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<h1 className="text-3xl font-bold tracking-tight">Request Money</h1>
						<p className="text-muted-foreground mt-1">
							Create payment requests and share payment links
						</p>
					</motion.div>

					<div className="grid gap-6 lg:grid-cols-3">
						{/* Request Form */}
						<motion.div
							className="lg:col-span-2"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							<Card className="bg-card-gradient shadow-card border-border/50">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<HandCoins className="h-5 w-5 text-primary" />
										New Request
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-6">
									<Tabs defaultValue="email">
										<TabsList className="grid w-full grid-cols-3 bg-muted/50">
											<TabsTrigger value="email" className="gap-2">
												<Mail className="h-4 w-4" />
												Email
											</TabsTrigger>
											<TabsTrigger value="phone" className="gap-2">
												<Phone className="h-4 w-4" />
												Phone
											</TabsTrigger>
											<TabsTrigger value="user" className="gap-2">
												<User className="h-4 w-4" />
												Username
											</TabsTrigger>
										</TabsList>

										<TabsContent value="email" className="mt-6 space-y-4">
											<div className="space-y-2">
												<Label>Recipient Email</Label>
												<Input
													type="email"
													placeholder="name@example.com"
													className="bg-muted/50"
												/>
											</div>
										</TabsContent>
										<TabsContent value="phone" className="mt-6 space-y-4">
											<div className="space-y-2">
												<Label>Phone Number</Label>
												<Input
													type="tel"
													placeholder="+1 (555) 000-0000"
													className="bg-muted/50"
												/>
											</div>
										</TabsContent>
										<TabsContent value="user" className="mt-6 space-y-4">
											<div className="space-y-2">
												<Label>FinPay Username</Label>
												<Input
													placeholder="@username"
													className="bg-muted/50"
												/>
											</div>
										</TabsContent>
									</Tabs>

									{/* Amount */}
									<div className="space-y-2">
										<Label>Amount</Label>
										<div className="relative">
											<DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
											<Input
												type="number"
												placeholder="0.00"
												value={amount}
												onChange={(e) => setAmount(e.target.value)}
												className="pl-12 text-3xl font-bold h-16 bg-muted/50 number-display"
											/>
										</div>
									</div>

									{/* Note & Expiry */}
									<div className="grid gap-4 md:grid-cols-2">
										<div className="space-y-2">
											<Label>Note</Label>
											<Input
												placeholder="What's this for?"
												className="bg-muted/50"
											/>
										</div>
										<div className="space-y-2">
											<Label>Expires In</Label>
											<Select defaultValue="7">
												<SelectTrigger className="bg-muted/50">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="1">1 day</SelectItem>
													<SelectItem value="3">3 days</SelectItem>
													<SelectItem value="7">7 days</SelectItem>
													<SelectItem value="30">30 days</SelectItem>
													<SelectItem value="never">Never</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>

									<Button size="lg" className="w-full bg-primary-gradient">
										<HandCoins className="mr-2 h-4 w-4" />
										Send Request
									</Button>
								</CardContent>
							</Card>
						</motion.div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Payment Link */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								<Card className="bg-card-gradient shadow-card border-border/50">
									<CardHeader className="pb-4">
										<CardTitle className="text-base flex items-center gap-2">
											<Link2 className="h-4 w-4 text-primary" />
											Your Payment Link
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex items-center gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
											<code className="text-sm flex-1 truncate">
												{paymentLink}
											</code>
											<Button
												size="icon"
												variant="ghost"
												className="shrink-0"
												onClick={copyLink}
											>
												<Copy className="h-4 w-4" />
											</Button>
										</div>
										<div className="flex gap-2">
											<Button
												variant="outline"
												size="sm"
												className="flex-1 gap-2"
											>
												<Share2 className="h-3 w-3" />
												Share
											</Button>
											<Button
												variant="outline"
												size="sm"
												className="flex-1 gap-2"
											>
												<QrCode className="h-3 w-3" />
												QR Code
											</Button>
										</div>
									</CardContent>
								</Card>
							</motion.div>

							{/* Summary */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								<Card className="bg-card-gradient shadow-card border-border/50">
									<CardHeader className="pb-4">
										<CardTitle className="text-base">Request Summary</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Pending</span>
											<span className="font-semibold text-warning number-display">
												{new Intl.NumberFormat("en-US", {
													style: "currency",
													currency: "USD",
												}).format(totalPending)}
											</span>
										</div>
										<Separator />
										<div className="flex justify-between">
											<span className="text-muted-foreground">
												Total Requests
											</span>
											<span className="font-medium">
												{pendingRequests.length}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Paid</span>
											<span className="font-medium text-success">
												{
													pendingRequests.filter((r) => r.status === "paid")
														.length
												}
											</span>
										</div>
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</div>

					{/* Request History */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.35 }}
					>
						<Card className="bg-card-gradient shadow-card border-border/50">
							<CardHeader>
								<CardTitle className="text-lg">Request History</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="space-y-3">
									{pendingRequests.map((req) => {
										const StatusIcon = statusConfig[req.status].icon;
										return (
											<div
												key={req.id}
												className="flex items-center justify-between p-4 rounded-lg bg-accent/30 hover:bg-accent/50 transition-colors"
											>
												<div className="flex items-center gap-3">
													<div className="p-2 rounded-full bg-primary/10">
														<HandCoins className="h-4 w-4 text-primary" />
													</div>
													<div>
														<p className="font-medium">{req.recipient}</p>
														<p className="text-sm text-muted-foreground">
															{req.note} · {req.date}
														</p>
													</div>
												</div>
												<div className="flex items-center gap-3">
													<span className="font-semibold number-display">
														{new Intl.NumberFormat("en-US", {
															style: "currency",
															currency: "USD",
														}).format(req.amount)}
													</span>
													<Badge
														variant="outline"
														className={`capitalize ${statusConfig[req.status].color}`}
													>
														<StatusIcon className="h-3 w-3 mr-1" />
														{req.status}
													</Badge>
												</div>
											</div>
										);
									})}
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</main>
			</div>
		</DashboardLayout>
	);
}
