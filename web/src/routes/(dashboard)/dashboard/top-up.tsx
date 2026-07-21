import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Building2,
	CheckCircle2,
	Clock,
	CreditCard,
	DollarSign,
	Shield,
	Smartphone,
	Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
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
import DashboardLayout from "@/layout/DashboardLayout";

const quickAmounts = [25, 50, 100, 250, 500, 1000];

const topUpMethods = [
	{
		id: "card",
		icon: CreditCard,
		label: "Debit/Credit Card",
		description: "Instant · No fee",
		badge: "Instant",
	},
	{
		id: "bank",
		icon: Building2,
		label: "Bank Transfer",
		description: "1-3 business days · No fee",
		badge: "Free",
	},
	{
		id: "mobile",
		icon: Smartphone,
		label: "Mobile Wallet",
		description: "Instant · $0.50 fee",
		badge: "Instant",
	},
];

const recentTopUps = [
	{
		id: "1",
		amount: 500,
		method: "Visa •••• 4567",
		date: "Jul 20, 2024",
		status: "completed",
	},
	{
		id: "2",
		amount: 200,
		method: "Bank Transfer",
		date: "Jul 15, 2024",
		status: "completed",
	},
	{
		id: "3",
		amount: 1000,
		method: "Visa •••• 4567",
		date: "Jul 10, 2024",
		status: "completed",
	},
	{
		id: "4",
		amount: 100,
		method: "Apple Pay",
		date: "Jul 5, 2024",
		status: "completed",
	},
];
export const Route = createFileRoute("/(dashboard)/dashboard/top-up")({
	component: RouteComponent,
});

function RouteComponent() {
	const [amount, setAmount] = useState("");
	const [selectedMethod, setSelectedMethod] = useState("card");

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				{/* Main Content */}
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<h1 className="text-3xl font-bold tracking-tight">Top Up</h1>
						<p className="text-muted-foreground mt-1">
							Add funds to your FinPay account
						</p>
					</motion.div>

					<div className="grid gap-6 lg:grid-cols-3">
						{/* Main Form */}
						<motion.div
							className="lg:col-span-2 space-y-6"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							{/* Account Selection */}
							<Card className="bg-card-gradient shadow-card border-border/50">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Wallet className="h-5 w-5 text-primary" />
										Select Account
									</CardTitle>
								</CardHeader>
								<CardContent>
									<Select defaultValue="checking">
										<SelectTrigger className="bg-muted/50">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="checking">
												Checking Account •••• 1234 — $15,450.20
											</SelectItem>
											<SelectItem value="savings">
												Savings Account •••• 5678 — $32,100.55
											</SelectItem>
										</SelectContent>
									</Select>
								</CardContent>
							</Card>

							{/* Amount */}
							<Card className="bg-card-gradient shadow-card border-border/50">
								<CardHeader>
									<CardTitle className="text-base">Enter Amount</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
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
									<div className="flex flex-wrap gap-2">
										{quickAmounts.map((q) => (
											<Button
												key={q}
												variant={amount === String(q) ? "default" : "outline"}
												size="sm"
												onClick={() => setAmount(String(q))}
												className={
													amount === String(q) ? "bg-primary-gradient" : ""
												}
											>
												${q}
											</Button>
										))}
									</div>
								</CardContent>
							</Card>

							{/* Payment Method */}
							<Card className="bg-card-gradient shadow-card border-border/50">
								<CardHeader>
									<CardTitle className="text-base">Payment Method</CardTitle>
								</CardHeader>
								<CardContent className="space-y-3">
									{topUpMethods.map((method) => (
										<button
											key={method.id}
											onClick={() => setSelectedMethod(method.id)}
											className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${
												selectedMethod === method.id
													? "border-primary bg-primary/5"
													: "border-border/50 hover:bg-accent/50"
											}`}
										>
											<div
												className={`p-2 rounded-lg ${selectedMethod === method.id ? "bg-primary/10" : "bg-muted"}`}
											>
												<method.icon
													className={`h-5 w-5 ${selectedMethod === method.id ? "text-primary" : "text-muted-foreground"}`}
												/>
											</div>
											<div className="flex-1 text-left">
												<p className="font-medium">{method.label}</p>
												<p className="text-sm text-muted-foreground">
													{method.description}
												</p>
											</div>
											<Badge variant="secondary" className="text-xs">
												{method.badge}
											</Badge>
										</button>
									))}

									{selectedMethod === "card" && (
										<motion.div
											initial={{ opacity: 0, height: 0 }}
											animate={{ opacity: 1, height: "auto" }}
											className="space-y-4 pt-4"
										>
											<div className="space-y-2">
												<Label>Card Number</Label>
												<Input
													placeholder="1234 5678 9012 3456"
													className="bg-muted/50"
												/>
											</div>
											<div className="grid grid-cols-2 gap-4">
												<div className="space-y-2">
													<Label>Expiry</Label>
													<Input placeholder="MM/YY" className="bg-muted/50" />
												</div>
												<div className="space-y-2">
													<Label>CVV</Label>
													<Input placeholder="•••" className="bg-muted/50" />
												</div>
											</div>
										</motion.div>
									)}

									<Separator />

									<Button
										size="lg"
										className="w-full bg-primary-gradient"
										disabled={!amount}
									>
										<Wallet className="mr-2 h-4 w-4" />
										Top Up {amount ? `$${Number(amount).toFixed(2)}` : ""}
										<ArrowRight className="ml-2 h-4 w-4" />
									</Button>
								</CardContent>
							</Card>
						</motion.div>

						{/* Sidebar */}
						<div className="space-y-6">
							{/* Security Notice */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								<Card className="bg-card-gradient shadow-card border-border/50">
									<CardContent className="p-6 space-y-4">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-full bg-success/10">
												<Shield className="h-5 w-5 text-success" />
											</div>
											<div>
												<p className="font-medium">Secure Transaction</p>
												<p className="text-sm text-muted-foreground">
													256-bit SSL encryption
												</p>
											</div>
										</div>
										<Separator />
										<div className="space-y-2 text-sm text-muted-foreground">
											<div className="flex items-center gap-2">
												<CheckCircle2 className="h-3 w-3 text-success" />
												<span>No hidden fees</span>
											</div>
											<div className="flex items-center gap-2">
												<CheckCircle2 className="h-3 w-3 text-success" />
												<span>Instant card top-ups</span>
											</div>
											<div className="flex items-center gap-2">
												<CheckCircle2 className="h-3 w-3 text-success" />
												<span>FDIC insured</span>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>

							{/* Recent Top-Ups */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								<Card className="bg-card-gradient shadow-card border-border/50">
									<CardHeader className="pb-4">
										<CardTitle className="text-base flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											Recent Top-Ups
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{recentTopUps.map((item) => (
											<div
												key={item.id}
												className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
											>
												<div>
													<p className="font-medium number-display">
														+${item.amount.toFixed(2)}
													</p>
													<p className="text-sm text-muted-foreground">
														{item.method}
													</p>
												</div>
												<div className="text-right">
													<Badge
														variant="outline"
														className="bg-success/10 text-success border-success/20 text-xs"
													>
														{item.status}
													</Badge>
													<p className="text-xs text-muted-foreground mt-1">
														{item.date}
													</p>
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
