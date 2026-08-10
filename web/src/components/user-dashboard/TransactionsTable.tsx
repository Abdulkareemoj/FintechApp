import { ArrowDownLeft, ArrowUpRight, MoreVertical } from "lucide-react";
import { motion } from "motion/react";
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
	EmptyTitle,
} from "@/components/ui/empty";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

interface Transaction {
	id: string;
	name: string;
	email: string;
	amount: number;
	status: "completed" | "pending" | "processing" | "failed";
	date: string;
	type: "incoming" | "outgoing";
	currency?: string; // Defaults to USD if omitted
}

interface TransactionsTableProps {
	transactions: Transaction[];
}

const statusVariants = {
	completed: "bg-success/10 text-success border-success/20",
	pending: "bg-warning/10 text-warning border-warning/20",
	processing: "bg-primary/10 text-primary border-primary/20",
	failed: "bg-destructive/10 text-destructive border-destructive/20",
};

export function TransactionsTable({ transactions }: TransactionsTableProps) {
	const formatAmount = (
		amount: number,
		type: "incoming" | "outgoing",
		currency = "USD",
	) => {
		const formatted = new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
		}).format(Math.abs(amount));
		return type === "incoming" ? `+${formatted}` : `-${formatted}`;
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			initial={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.4, delay: 0.2 }}
		>
			<Card className="border-border/50 bg-card-gradient shadow-card">
				<CardHeader className="flex flex-row items-center justify-between pb-4">
					<div>
						<CardTitle className="font-semibold text-lg">
							Recent Transactions
						</CardTitle>
						<p className="mt-1 text-muted-foreground text-sm">
							Your latest financial activity
						</p>
					</div>
					<Button
						className="text-primary hover:text-primary/80"
						size="sm"
						variant="ghost"
					>
						View All
					</Button>
				</CardHeader>
				<CardContent>
					{transactions.length === 0 ? (
						<div className="py-8">
							<Empty className="border-0 py-4">
								<EmptyHeader>
									<EmptyTitle>No transactions yet</EmptyTitle>
									<EmptyDescription>
										Your latest activity will appear here.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						</div>
					) : (
						<Table>
							<TableHeader>
								<TableRow className="border-border/50 hover:bg-transparent">
									<TableHead className="text-muted-foreground">
										Transaction
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
								{transactions.map((transaction, index) => (
									<motion.tr
										animate={{ opacity: 1, x: 0 }}
										className="group border-border/30 transition-colors hover:bg-accent/50"
										initial={{ opacity: 0, x: -10 }}
										key={transaction.id}
										transition={{ duration: 0.3, delay: index * 0.05 }}
									>
										<TableCell className="py-4">
											<div className="flex items-center gap-3">
												<div
													className={cn(
														"rounded-full p-2",
														transaction.type === "incoming"
															? "bg-success/10"
															: "bg-muted",
													)}
												>
													{transaction.type === "incoming" ? (
														<ArrowDownLeft className="size-4 text-success" />
													) : (
														<ArrowUpRight className="size-4 text-muted-foreground" />
													)}
												</div>
												<div>
													<p className="font-medium">{transaction.name}</p>
													<p className="hidden text-muted-foreground text-sm md:block">
														{transaction.email}
													</p>
												</div>
											</div>
										</TableCell>
										<TableCell>
											<Badge
												className={cn(
													"capitalize",
													statusVariants[transaction.status],
												)}
												variant="outline"
											>
												{transaction.status}
											</Badge>
										</TableCell>
										<TableCell className="hidden text-muted-foreground md:table-cell">
											{formatDate(transaction.date)}
										</TableCell>
										<TableCell className="text-right">
											<span
												className={cn(
													"number-display font-semibold",
													transaction.type === "incoming"
														? "text-success"
														: "text-foreground",
												)}
											>
												{formatAmount(
													transaction.amount,
													transaction.type,
													transaction.currency,
												)}
											</span>
										</TableCell>
										<TableCell>
											<DropdownMenu>
												<DropdownMenuTrigger asChild>
													<Button
														className="size-8 opacity-0 transition-opacity group-hover:opacity-100"
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
													<DropdownMenuItem>View Details</DropdownMenuItem>
													<DropdownMenuItem>Download Receipt</DropdownMenuItem>
													<DropdownMenuItem>Report Issue</DropdownMenuItem>
												</DropdownMenuContent>
											</DropdownMenu>
										</TableCell>
									</motion.tr>
								))}
							</TableBody>
						</Table>
					)}
				</CardContent>
			</Card>
		</motion.div>
	);
}
