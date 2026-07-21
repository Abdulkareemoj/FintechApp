import {
	createFileRoute,
	useNavigate,
	useParams,
} from "@tanstack/react-router";
import {
	ArrowDownLeft,
	ArrowLeft,
	ArrowUpRight,
	Calendar,
	CheckCircle2,
	Clock,
	Copy,
	CreditCard,
	Download,
	FileText,
	Flag,
	MapPin,
	Share2,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import DashboardLayout from "@/layout/DashboardLayout";

const transactionsData: Record<
	string,
	{
		id: string;
		name: string;
		email: string;
		category: string;
		amount: number;
		status: string;
		date: string;
		time: string;
		type: string;
		method: string;
		reference: string;
		location: string;
		description: string;
		fee: number;
	}
> = {
	TXN001: {
		id: "TXN001",
		name: "Starbucks",
		email: "coffee@starbucks.com",
		category: "Food & Drink",
		amount: 15.0,
		status: "completed",
		date: "2024-07-20",
		time: "09:34 AM",
		type: "outgoing",
		method: "Visa Debit •••• 4567",
		reference: "REF-8X92K4M1",
		location: "123 Main St, New York, NY",
		description: "Grande Latte + Croissant",
		fee: 0,
	},
	TXN002: {
		id: "TXN002",
		name: "Amazon Prime",
		email: "prime@amazon.com",
		category: "Shopping",
		amount: 120.5,
		status: "completed",
		date: "2024-07-19",
		time: "02:15 PM",
		type: "outgoing",
		method: "Visa Debit •••• 4567",
		reference: "REF-3M7PL9N2",
		location: "Online",
		description: "Annual Prime Membership Renewal",
		fee: 0,
	},
	TXN003: {
		id: "TXN003",
		name: "Salary Deposit",
		email: "hr@acmeinc.com",
		category: "Income",
		amount: 5000.0,
		status: "completed",
		date: "2024-07-18",
		time: "12:00 AM",
		type: "incoming",
		method: "Bank Transfer - ACH",
		reference: "REF-5K1NQ8W3",
		location: "Acme Inc.",
		description: "Monthly salary - July 2024",
		fee: 0,
	},
	TXN004: {
		id: "TXN004",
		name: "Netflix",
		email: "billing@netflix.com",
		category: "Entertainment",
		amount: 19.99,
		status: "completed",
		date: "2024-07-17",
		time: "06:00 AM",
		type: "outgoing",
		method: "Mastercard •••• 9012",
		reference: "REF-9W4TH2X6",
		location: "Online",
		description: "Standard Plan - Monthly Subscription",
		fee: 0,
	},
	TXN005: {
		id: "TXN005",
		name: "Freelance Payment",
		email: "client@freelance.co",
		category: "Income",
		amount: 800.0,
		status: "pending",
		date: "2024-07-16",
		time: "03:45 PM",
		type: "incoming",
		method: "Bank Transfer - Wire",
		reference: "REF-2P6YM3K7",
		location: "Freelance Co.",
		description: "Website redesign project - Phase 2",
		fee: 2.5,
	},
};

const statusVariants: Record<string, string> = {
	completed: "bg-success/10 text-success border-success/20",
	pending: "bg-warning/10 text-warning border-warning/20",
	processing: "bg-primary/10 text-primary border-primary/20",
	failed: "bg-destructive/10 text-destructive border-destructive/20",
};
export const Route = createFileRoute("/(dashboard)/dashboard/transactions/$id")(
	{
		component: TransactionDetailPage,
	},
);

function TransactionDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const tx = transactionsData[id || ""] || transactionsData["TXN001"];

	const formatAmount = (amount: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(amount);

	const copyRef = () => {
		navigator.clipboard.writeText(tx.reference);
		toast.success("Reference copied");
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
						<Button
							variant="ghost"
							onClick={() => navigate("/dashboard/transactions")}
							className="gap-2 -ml-2"
						>
							<ArrowLeft className="h-4 w-4" />
							Back to Transactions
						</Button>
					</motion.div>

					{/* Hero Card */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="bg-card-gradient shadow-card border-border/50">
							<CardContent className="p-8">
								<div className="flex flex-col items-center text-center space-y-4">
									<div
										className={`p-4 rounded-full ${tx.type === "incoming" ? "bg-success/10" : "bg-muted"}`}
									>
										{tx.type === "incoming" ? (
											<ArrowDownLeft className="h-8 w-8 text-success" />
										) : (
											<ArrowUpRight className="h-8 w-8 text-muted-foreground" />
										)}
									</div>
									<div>
										<h2 className="text-xl font-semibold">{tx.name}</h2>
										<p className="text-sm text-muted-foreground">{tx.email}</p>
									</div>
									<p
										className={`text-4xl font-bold number-display ${tx.type === "incoming" ? "text-success" : ""}`}
									>
										{tx.type === "incoming" ? "+" : "-"}
										{formatAmount(tx.amount)}
									</p>
									<Badge
										variant="outline"
										className={`capitalize text-sm ${statusVariants[tx.status]}`}
									>
										<CheckCircle2 className="h-3 w-3 mr-1" />
										{tx.status}
									</Badge>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<div className="grid gap-6 md:grid-cols-2">
						{/* Details */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							<Card className="bg-card-gradient shadow-card border-border/50 h-full">
								<CardHeader>
									<CardTitle className="text-base">
										Transaction Details
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{[
										{
											icon: FileText,
											label: "Reference",
											value: tx.reference,
											copyable: true,
										},
										{ icon: Calendar, label: "Date", value: tx.date },
										{ icon: Clock, label: "Time", value: tx.time },
										{
											icon: CreditCard,
											label: "Payment Method",
											value: tx.method,
										},
										{ icon: MapPin, label: "Location", value: tx.location },
									].map((item) => (
										<div key={item.label} className="flex items-start gap-3">
											<item.icon className="h-4 w-4 text-muted-foreground mt-0.5 shrink-0" />
											<div className="flex-1 min-w-0">
												<p className="text-sm text-muted-foreground">
													{item.label}
												</p>
												<div className="flex items-center gap-2">
													<p className="font-medium truncate">{item.value}</p>
													{item.copyable && (
														<Button
															size="icon"
															variant="ghost"
															className="h-6 w-6 shrink-0"
															onClick={copyRef}
														>
															<Copy className="h-3 w-3" />
														</Button>
													)}
												</div>
											</div>
										</div>
									))}
								</CardContent>
							</Card>
						</motion.div>

						{/* Summary & Description */}
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.25 }}
						>
							<Card className="bg-card-gradient shadow-card border-border/50 h-full">
								<CardHeader>
									<CardTitle className="text-base">Summary</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									<div>
										<p className="text-sm text-muted-foreground">Description</p>
										<p className="font-medium">{tx.description}</p>
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Category</p>
										<Badge variant="secondary">{tx.category}</Badge>
									</div>
									<Separator />
									<div className="space-y-2">
										<div className="flex justify-between">
											<span className="text-muted-foreground">Subtotal</span>
											<span className="number-display">
												{formatAmount(tx.amount)}
											</span>
										</div>
										<div className="flex justify-between">
											<span className="text-muted-foreground">Fee</span>
											<span className="number-display">
												{formatAmount(tx.fee)}
											</span>
										</div>
										<Separator />
										<div className="flex justify-between font-semibold">
											<span>Total</span>
											<span className="number-display">
												{formatAmount(tx.amount + tx.fee)}
											</span>
										</div>
									</div>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					{/* Actions */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
					>
						<div className="flex flex-wrap gap-3">
							<Button variant="outline" className="gap-2">
								<Download className="h-4 w-4" />
								Download Receipt
							</Button>
							<Button variant="outline" className="gap-2">
								<Share2 className="h-4 w-4" />
								Share
							</Button>
							<Button
								variant="outline"
								className="gap-2 text-destructive hover:text-destructive"
							>
								<Flag className="h-4 w-4" />
								Report Issue
							</Button>
						</div>
					</motion.div>
				</main>
			</div>
		</DashboardLayout>
	);
}
