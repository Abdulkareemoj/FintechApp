import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
	ArrowDownLeft,
	ArrowUpRight,
	Calendar,
	Download,
	MoreVertical,
	Search,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "@/components/ui/empty";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useTransactions } from "@/hooks/useTransactions";
import DashboardLayout from "@/layout/DashboardLayout";
import type { Transaction } from "@/lib/api/transactions";
import { cn } from "@/lib/utils";

const statusVariants: Record<string, string> = {
	completed: "bg-success/10 text-success border-success/20",
	pending: "bg-warning/10 text-warning border-warning/20",
	processing: "bg-primary/10 text-primary border-primary/20",
	paid: "bg-success/10 text-success border-success/20",
	failed: "bg-destructive/10 text-destructive border-destructive/20",
};

function humanize(value: string) {
	if (!value) return "—";
	return value
		.toLowerCase()
		.split(/[\s_-]+/)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

export const Route = createFileRoute("/(dashboard)/dashboard/transactions/")({
	component: TransactionsPage,
});

function TransactionsPage() {
	const navigate = useNavigate();
	const [searchQuery, setSearchQuery] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");
	const [isExiting, setIsExiting] = useState(false);

	const goToDetail = (id: string) => {
		setIsExiting(true);
		window.setTimeout(() => {
			navigate({
				to: "/dashboard/transactions/$id",
				params: { id },
			});
		}, 200);
	};

	const { data, isPending, isError, refetch } = useTransactions({
		page: 1,
		pageSize: 100,
	});

	const items: Transaction[] = (data?.items ?? []) as Transaction[];

	const filteredTransactions = items.filter((tx) => {
		const matchesSearch =
			tx.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
			tx.type.toLowerCase().includes(searchQuery.toLowerCase());
		const matchesStatus =
			statusFilter === "all" || tx.status.toLowerCase() === statusFilter;
		const matchesType = typeFilter === "all" || tx.direction === typeFilter;
		return matchesSearch && matchesStatus && matchesType;
	});

	const formatAmount = (
		amount: number,
		currency: string,
		direction: string,
	) => {
		const formatted = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
		}).format(Math.abs(amount));
		return direction === "incoming" ? `+${formatted}` : `-${formatted}`;
	};

	const formatDate = (dateString: string) =>
		new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});

	const totalIncome = items
		.filter((t) => t.direction === "incoming")
		.reduce((sum, t) => sum + t.amount, 0);
	const totalExpenses = items
		.filter((t) => t.direction === "outgoing")
		.reduce((sum, t) => sum + t.amount, 0);

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				{/* Main Content */}
				<main
					className={cn(
						"mx-auto flex flex-col gap-6 px-6 py-8",
						isExiting && "t-page-exit",
					)}
				>
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center"
						initial={{ opacity: 0, y: 10 }}
					>
						<div>
							<h1 className="font-bold text-3xl tracking-tight">
								Transactions
							</h1>
							<p className="mt-1 text-muted-foreground">
								View and manage your transaction history
							</p>
						</div>
						<Button variant="outline" disabled>
							<Download data-icon />
							Export CSV
						</Button>
					</motion.div>

					{/* Summary Cards */}
					<div className="grid gap-4 md:grid-cols-3">
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.1 }}
						>
							<Card className="border-border/50 bg-card-gradient shadow-card">
								<CardContent className="p-6">
									<p className="text-muted-foreground text-sm">Total Income</p>
									<p className="number-display mt-1 font-bold text-2xl text-success">
										+
										{new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(totalIncome)}
									</p>
								</CardContent>
							</Card>
						</motion.div>
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.15 }}
						>
							<Card className="border-border/50 bg-card-gradient shadow-card">
								<CardContent className="p-6">
									<p className="text-muted-foreground text-sm">
										Total Expenses
									</p>
									<p className="number-display mt-1 font-bold text-2xl text-destructive">
										-
										{new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
										}).format(totalExpenses)}
									</p>
								</CardContent>
							</Card>
						</motion.div>
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.2 }}
						>
							<Card className="border-border/50 bg-card-gradient shadow-card">
								<CardContent className="p-6">
									<p className="text-muted-foreground text-sm">Net Balance</p>
									<p
										className={cn(
											"number-display mt-1 font-bold text-2xl",
											totalIncome - totalExpenses >= 0
												? "text-success"
												: "text-destructive",
										)}
									>
										{new Intl.NumberFormat("en-US", {
											style: "currency",
											currency: "USD",
											signDisplay: "always",
										}).format(totalIncome - totalExpenses)}
									</p>
								</CardContent>
							</Card>
						</motion.div>
					</div>

					{/* Filters */}
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.25 }}
					>
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardContent className="p-4">
								<div className="flex flex-col gap-4 md:flex-row">
									<div className="relative flex-1">
										<Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
										<Input
											className="bg-muted/50 pl-10"
											onChange={(e) => setSearchQuery(e.target.value)}
											placeholder="Search transactions..."
											value={searchQuery}
										/>
									</div>
									<Select onValueChange={setStatusFilter} value={statusFilter}>
										<SelectTrigger className="w-full bg-muted/50 md:w-40">
											<SelectValue placeholder="Status" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Status</SelectItem>
											<SelectItem value="completed">Completed</SelectItem>
											<SelectItem value="pending">Pending</SelectItem>
											<SelectItem value="processing">Processing</SelectItem>
										</SelectContent>
									</Select>
									<Select onValueChange={setTypeFilter} value={typeFilter}>
										<SelectTrigger className="w-full bg-muted/50 md:w-40">
											<SelectValue placeholder="Type" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value="all">All Types</SelectItem>
											<SelectItem value="incoming">Income</SelectItem>
											<SelectItem value="outgoing">Expenses</SelectItem>
										</SelectContent>
									</Select>
									<Button className="gap-2" variant="outline" disabled>
										<Calendar data-icon />
										Date Range
									</Button>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Transactions Table */}
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.3 }}
					>
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardHeader className="pb-4">
								<CardTitle className="text-lg">Transaction History</CardTitle>
							</CardHeader>
							<CardContent>
								<Table>
									<TableHeader>
										<TableRow className="border-border/50 hover:bg-transparent">
											<TableHead className="text-muted-foreground">
												Transaction
											</TableHead>
											<TableHead className="text-muted-foreground">
												Category
											</TableHead>
											<TableHead className="hidden text-muted-foreground md:table-cell">
												Method
											</TableHead>
											<TableHead className="text-muted-foreground">
												Status
											</TableHead>
											<TableHead className="hidden text-muted-foreground md:table-cell">
												Date
											</TableHead>
											<TableHead className="text-right text-muted-foreground">
												Amount
											</TableHead>
											<TableHead className="w-10" />
										</TableRow>
									</TableHeader>
									<TableBody>
										{isPending ? (
											<TableRow>
												<TableCell colSpan={7} className="py-8 text-center">
													<span className="inline-flex items-center gap-2 text-muted-foreground">
														<Spinner />
														Loading transactions…
													</span>
												</TableCell>
											</TableRow>
										) : isError ? (
											<TableRow>
												<TableCell colSpan={7} className="py-8">
													<Empty className="border-0">
														<EmptyHeader>
															<EmptyTitle>
																Couldn't load transactions
															</EmptyTitle>
															<EmptyDescription>
																Something went wrong while fetching your
																transaction history.
															</EmptyDescription>
														</EmptyHeader>
														<Button
															onClick={() => refetch()}
															size="sm"
															variant="outline"
														>
															Retry
														</Button>
													</Empty>
												</TableCell>
											</TableRow>
										) : filteredTransactions.length === 0 ? (
											<TableRow>
												<TableCell colSpan={7} className="py-8">
													<Empty className="border-0">
														<EmptyHeader>
															<EmptyMedia variant="icon">
																<Search />
															</EmptyMedia>
															<EmptyTitle>No transactions found</EmptyTitle>
															<EmptyDescription>
																Try adjusting your search or filters, or make
																your first transaction.
															</EmptyDescription>
														</EmptyHeader>
													</Empty>
												</TableCell>
											</TableRow>
										) : (
											filteredTransactions.map((tx, index) => (
												<motion.tr
													animate={{ opacity: 1, x: 0 }}
													className="group cursor-pointer border-border/30 transition-colors hover:bg-accent/50"
													initial={{ opacity: 0, x: -10 }}
													key={tx.id}
													onClick={() => goToDetail(tx.id)}
													transition={{ delay: 0.3 + index * 0.03 }}
												>
													<TableCell className="py-4">
														<div className="flex items-center gap-3">
															<div
																className={cn(
																	"rounded-full p-2",
																	tx.direction === "incoming"
																		? "bg-success/10"
																		: "bg-muted",
																)}
															>
																{tx.direction === "incoming" ? (
																	<ArrowDownLeft className="size-4 text-success" />
																) : (
																	<ArrowUpRight className="size-4 text-muted-foreground" />
																)}
															</div>
															<div>
																<p className="font-medium">
																	{tx.description || humanize(tx.type)}
																</p>
																<p className="text-muted-foreground text-xs">
																	{tx.id}
																</p>
															</div>
														</div>
													</TableCell>
													<TableCell>
														<Badge className="font-normal" variant="secondary">
															{humanize(tx.type)}
														</Badge>
													</TableCell>
													<TableCell className="hidden text-muted-foreground md:table-cell">
														{humanize(tx.direction)} · {humanize(tx.status)}
													</TableCell>
													<TableCell>
														<Badge
															className={cn(
																"capitalize",
																statusVariants[tx.status.toLowerCase()] ??
																	statusVariants.completed,
															)}
															variant="outline"
														>
															{humanize(tx.status)}
														</Badge>
													</TableCell>
													<TableCell className="hidden text-muted-foreground md:table-cell">
														{formatDate(tx.createdAt)}
													</TableCell>
													<TableCell className="text-right">
														<span
															className={cn(
																"number-display font-semibold",
																tx.direction === "incoming"
																	? "text-success"
																	: "text-foreground",
															)}
														>
															{formatAmount(
																tx.amount,
																tx.currency,
																tx.direction,
															)}
														</span>
													</TableCell>
													<TableCell onClick={(e) => e.stopPropagation()}>
														<DropdownMenu>
															<DropdownMenuTrigger asChild>
																<Button
																	className="size-8 opacity-0 group-hover:opacity-100"
																	size="icon"
																	variant="ghost"
																>
																	<MoreVertical data-icon />
																</Button>
															</DropdownMenuTrigger>
															<DropdownMenuContent
																align="end"
																className="border-border bg-card"
															>
																<DropdownMenuItem
																	onSelect={() => goToDetail(tx.id)}
																>
																	View Details
																</DropdownMenuItem>
															</DropdownMenuContent>
														</DropdownMenu>
													</TableCell>
												</motion.tr>
											))
										)}
									</TableBody>
								</Table>
							</CardContent>
						</Card>
					</motion.div>
				</main>
			</div>
		</DashboardLayout>
	);
}
