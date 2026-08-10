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
	FileText,
	Share2,
	User,
} from "lucide-react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { Separator } from "@/components/ui/separator";
import { Spinner } from "@/components/ui/spinner";
import { useTransaction } from "@/hooks/useTransactions";
import DashboardLayout from "@/layout/DashboardLayout";
import type { TransactionDetail } from "@/lib/api/transactions";
import { cn } from "@/lib/utils";

const statusVariants: Record<string, string> = {
	completed: "bg-success/10 text-success border-success/20",
	pending: "bg-warning/10 text-warning border-warning/20",
	processing: "bg-primary/10 text-primary border-primary/20",
	paid: "bg-success/10 text-success border-success/20",
	failed: "bg-destructive/10 text-destructive border-destructive/20",
};

function humanize(value: string | null | undefined) {
	if (!value) return "—";
	return value
		.toLowerCase()
		.split(/[\s_-]+/)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

function formatDateTime(iso: string) {
	const d = new Date(iso);
	return {
		date: d.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		}),
		time: d.toLocaleTimeString("en-US", {
			hour: "2-digit",
			minute: "2-digit",
		}),
	};
}

export const Route = createFileRoute("/(dashboard)/dashboard/transactions/$id")(
	{
		component: TransactionDetailPage,
	},
);

function TransactionDetailPage() {
	const { id } = useParams();
	const navigate = useNavigate();
	const { data, isPending, isError, refetch } = useTransaction(id);

	const tx = data as TransactionDetail;

	const formatAmount = (amount: number) => {
		const formatted = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: tx?.currency ?? "USD",
		}).format(Math.abs(amount));
		return formatted;
	};

	const copyRef = () => {
		if (!tx?.referenceId) return;
		navigator.clipboard.writeText(tx.referenceId);
		toast.success("Reference copied");
	};

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				{/* Main Content */}
				<main className="t-page-enter mx-auto flex flex-col gap-6 px-6 py-8">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<Button
							variant="ghost"
							onClick={() => navigate("/dashboard/transactions")}
							className="gap-2 -ml-2"
						>
							<ArrowLeft data-icon />
							Back to Transactions
						</Button>
					</motion.div>

					{isPending ? (
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardContent className="flex justify-center p-8 text-muted-foreground">
								<span className="inline-flex items-center gap-2">
									<Spinner />
									Loading transaction…
								</span>
							</CardContent>
						</Card>
					) : isError || !data ? (
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardContent className="p-8">
								<Empty className="border-0">
									<EmptyHeader>
										<EmptyTitle>Couldn't load this transaction</EmptyTitle>
										<EmptyDescription>
											Something went wrong while fetching this transaction.
										</EmptyDescription>
									</EmptyHeader>
									<Button onClick={() => refetch()} variant="outline">
										Retry
									</Button>
								</Empty>
							</CardContent>
						</Card>
					) : (
						<>
							{/* Hero Card */}
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.1 }}
							>
								<Card className="bg-card-gradient shadow-card border-border/50">
									<CardContent className="p-8">
										<div className="flex flex-col items-center gap-4 text-center">
											<div
												className={cn(
													"rounded-full p-4",
													tx.direction === "incoming"
														? "bg-success/10"
														: "bg-muted",
												)}
											>
												{tx.direction === "incoming" ? (
													<ArrowDownLeft className="size-8 text-success" />
												) : (
													<ArrowUpRight className="size-8 text-muted-foreground" />
												)}
											</div>
											<div>
												<h2 className="text-xl font-semibold">
													{tx.description || humanize(tx.type)}
												</h2>
												<p className="text-sm text-muted-foreground">
													{humanize(tx.type)} · {humanize(tx.direction)}
												</p>
											</div>
											<p
												className={cn(
													"number-display text-4xl font-bold",
													tx.direction === "incoming"
														? "text-success"
														: "text-foreground",
												)}
											>
												{tx.direction === "incoming" ? "+" : "-"}
												{formatAmount(tx.amount)}
											</p>
											<Badge
												variant="outline"
												className={cn(
													"text-sm capitalize",
													statusVariants[tx.status?.toLowerCase()] ??
														statusVariants.completed,
												)}
											>
												<CheckCircle2 data-icon />
												{humanize(tx.status)}
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
										<CardContent className="flex flex-col gap-4">
											{[
												{
													icon: FileText,
													label: "Reference",
													value: tx.referenceId || "—",
													copyable: !!tx.referenceId,
												},
												{
													icon: Calendar,
													label: "Date",
													value: formatDateTime(tx.createdAt).date,
												},
												{
													icon: Clock,
													label: "Time",
													value: formatDateTime(tx.createdAt).time,
												},
												{
													icon: Clock,
													label: "Completed",
													value: tx.completedAt
														? formatDateTime(tx.completedAt).date +
															" · " +
															formatDateTime(tx.completedAt).time
														: "—",
												},
												{
													icon: CreditCard,
													label: "Type",
													value: humanize(tx.type),
												},
												{
													icon: ArrowUpRight,
													label: "From",
													value: tx.fromWallet
														? tx.fromWallet.isCurrentUser
															? "You"
															: tx.fromWallet.ownerName || "User"
														: "—",
												},
												{
													icon: User,
													label: "To",
													value: tx.toWallet
														? tx.toWallet.isCurrentUser
															? "You"
															: tx.toWallet.ownerName || "User"
														: "—",
												},
											].map((item) => (
												<div
													key={item.label}
													className="flex items-start gap-3"
												>
													<item.icon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
													<div className="flex-1 min-w-0">
														<p className="text-sm text-muted-foreground">
															{item.label}
														</p>
														<div className="flex items-center gap-2">
															<p className="font-medium truncate">
																{item.value}
															</p>
															{item.copyable && (
																<Button
																	size="icon-sm"
																	variant="ghost"
																	className="shrink-0"
																	onClick={copyRef}
																>
																	<Copy data-icon />
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
										<CardContent className="flex flex-col gap-4">
											<div>
												<p className="text-sm text-muted-foreground">
													Description
												</p>
												<p className="font-medium">
													{tx.description || humanize(tx.type)}
												</p>
											</div>
											<div>
												<p className="text-sm text-muted-foreground">
													Category
												</p>
												<Badge variant="secondary">{humanize(tx.type)}</Badge>
											</div>
											<Separator />
											<div className="flex flex-col gap-2">
												<div className="flex justify-between">
													<span className="text-muted-foreground">
														Subtotal
													</span>
													<span className="number-display">
														{formatAmount(tx.amount)}
													</span>
												</div>
												<div className="flex justify-between">
													<span className="text-muted-foreground">Fee</span>
													<span className="number-display">
														{formatAmount(0)}
													</span>
												</div>
												<Separator />
												<div className="flex justify-between font-semibold">
													<span>Total</span>
													<span className="number-display">
														{formatAmount(tx.amount)}
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
									<Button variant="outline" className="gap-2" disabled>
										<FileText data-icon />
										Download Receipt
									</Button>
									<Button variant="outline" className="gap-2" disabled>
										<Share2 data-icon />
										Share
									</Button>
								</div>
							</motion.div>
						</>
					)}
				</main>
			</div>
		</DashboardLayout>
	);
}
