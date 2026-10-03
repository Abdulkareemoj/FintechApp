import { createFileRoute, Link } from "@tanstack/react-router";
import type { LucideIcon } from "lucide-react";
import {
	CheckCircle2,
	Clock,
	CreditCard,
	Droplets,
	Flame,
	Phone,
	Plus,
	Receipt,
	Search,
	Trash2,
	Tv,
	Wifi,
	Zap,
} from "lucide-react";
import { motion } from "motion/react";
import { type FormEvent, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
	useBills,
	useCreateBill,
	useDeleteBill,
	usePayBill,
	useQuickPayBill,
} from "@/hooks/useBills";
import { useWallets } from "@/hooks/useWallets";
import DashboardLayout from "@/layout/DashboardLayout";
import { BILL_CATEGORIES, type Bill, type BillStatus } from "@/lib/api/bills";
import { extractErrorMessage } from "@/lib/api/profile";

export const Route = createFileRoute("/(dashboard)/dashboard/bills")({
	component: BillsPage,
});

const CATEGORY_ICONS: Record<string, LucideIcon> = {
	Electricity: Zap,
	Water: Droplets,
	Gas: Flame,
	Internet: Wifi,
	Phone: Phone,
	"TV & Cable": Tv,
	Insurance: CreditCard,
	Airtime: Phone,
	Data: Wifi,
	Other: Receipt,
};

const CATEGORY_COLORS: Record<string, string> = {
	Electricity: "bg-yellow-500/10 text-yellow-500",
	Water: "bg-blue-500/10 text-blue-500",
	Gas: "bg-orange-500/10 text-orange-500",
	Internet: "bg-primary/10 text-primary",
	Phone: "bg-green-500/10 text-green-500",
	"TV & Cable": "bg-primary/10 text-primary",
	Insurance: "bg-pink-500/10 text-pink-500",
	Airtime: "bg-green-500/10 text-green-500",
	Data: "bg-blue-500/10 text-blue-500",
	Other: "bg-muted text-muted-foreground",
};

function categoryIcon(category: string): LucideIcon {
	return CATEGORY_ICONS[category] ?? Receipt;
}

function categoryColor(category: string): string {
	return CATEGORY_COLORS[category] ?? "bg-muted text-muted-foreground";
}

function StatusBadge({ status }: { status: BillStatus }) {
	if (status === "paid") return <Badge variant="secondary">Paid</Badge>;
	if (status === "overdue") return <Badge variant="destructive">Overdue</Badge>;
	if (status === "due") return <Badge variant="destructive">Due Soon</Badge>;
	return <Badge variant="secondary">Upcoming</Badge>;
}

function BillsPage() {
	const { data: bills, isPending, isError, refetch } = useBills();
	const { data: wallets, isPending: walletsPending } = useWallets();
	const createBill = useCreateBill();
	const deleteBill = useDeleteBill();
	const payBill = usePayBill();
	const quickPay = useQuickPayBill();

	const [search, setSearch] = useState("");
	const [walletId, setWalletId] = useState("");

	// Quick-pay dialog (category grid)
	const [quickOpen, setQuickOpen] = useState(false);
	const [quickCategory, setQuickCategory] = useState("Electricity");
	const [quickName, setQuickName] = useState("");
	const [quickAmount, setQuickAmount] = useState("");
	const [quickReference, setQuickReference] = useState("");

	// Scheduled pay dialog
	const [payTarget, setPayTarget] = useState<Bill | null>(null);

	// Add-bill dialog
	const [addOpen, setAddOpen] = useState(false);
	const [addName, setAddName] = useState("");
	const [addCategory, setAddCategory] = useState("Electricity");
	const [addAmount, setAddAmount] = useState("");
	const [addDueDate, setAddDueDate] = useState("");
	const [addReference, setAddReference] = useState("");

	const selectedWalletId = walletId || wallets?.[0]?.id || "";
	const unpaid = bills?.filter((b) => b.status !== "paid") ?? [];
	const paidBills = bills?.filter((b) => b.status === "paid") ?? [];
	const query = search.trim().toLowerCase();
	const visibleUnpaid = query
		? unpaid.filter(
				(b) =>
					b.name.toLowerCase().includes(query) ||
					b.category.toLowerCase().includes(query),
			)
		: unpaid;
	const totalDue = unpaid.reduce((sum, b) => sum + b.amount, 0);

	const openQuickPay = (category: string) => {
		setQuickCategory(category);
		setQuickName("");
		setQuickAmount("");
		setQuickReference("");
		setQuickOpen(true);
	};

	const handleQuickPay = (e: FormEvent) => {
		e.preventDefault();
		const amount = Number(quickAmount);
		if (!amount || amount <= 0) {
			toast.error("Enter a valid amount");
			return;
		}
		if (!selectedWalletId) {
			toast.error("No wallet available");
			return;
		}
		quickPay.mutate(
			{
				category: quickCategory,
				name: quickName.trim() || undefined,
				amount,
				reference: quickReference.trim() || undefined,
				walletId: selectedWalletId,
				idempotencyKey: crypto.randomUUID(),
			},
			{
				onSuccess: () => {
					toast.success("Bill paid");
					setQuickOpen(false);
				},
				onError: (err) => toast.error(extractErrorMessage(err)),
			},
		);
	};

	const handlePayScheduled = (e: FormEvent) => {
		e.preventDefault();
		if (!payTarget) return;
		if (!selectedWalletId) {
			toast.error("No wallet available");
			return;
		}
		payBill.mutate(
			{
				id: payTarget.id,
				req: {
					walletId: selectedWalletId,
					idempotencyKey: crypto.randomUUID(),
				},
			},
			{
				onSuccess: () => {
					toast.success(`Paid ${payTarget.name}`);
					setPayTarget(null);
				},
				onError: (err) => toast.error(extractErrorMessage(err)),
			},
		);
	};

	const handleAddBill = (e: FormEvent) => {
		e.preventDefault();
		const amount = Number(addAmount);
		if (!amount || amount <= 0) {
			toast.error("Enter a valid amount");
			return;
		}
		if (!addDueDate) {
			toast.error("Pick a due date");
			return;
		}
		createBill.mutate(
			{
				name: addName.trim(),
				category: addCategory,
				amount,
				dueDate: addDueDate,
				reference: addReference.trim() || undefined,
			},
			{
				onSuccess: () => {
					toast.success("Bill added");
					setAddOpen(false);
					setAddName("");
					setAddAmount("");
					setAddDueDate("");
					setAddReference("");
				},
				onError: (err) => toast.error(extractErrorMessage(err)),
			},
		);
	};

	const handleDelete = (bill: Bill) => {
		if (!window.confirm(`Delete "${bill.name}"?`)) return;
		deleteBill.mutate(bill.id, {
			onSuccess: () => toast.success("Bill deleted"),
			onError: (err) => toast.error(extractErrorMessage(err)),
		});
	};

	const walletSelect = (
		<Select
			onValueChange={(value) => {
				if (value) setWalletId(value);
			}}
			value={selectedWalletId}
		>
			<SelectTrigger className="bg-muted/50">
				<SelectValue placeholder={walletsPending ? "Loading…" : "Wallet"} />
			</SelectTrigger>
			<SelectContent>
				{wallets?.map((w) => (
					<SelectItem key={w.id} value={w.id}>
						{w.currencyCode} · ${w.balance.toFixed(2)}
					</SelectItem>
				))}
			</SelectContent>
		</Select>
	);

	const listRows = (rows: Bill[], mode: "upcoming" | "paid") =>
		rows.map((bill, index) => {
			const Icon = categoryIcon(bill.category);
			const isDue = bill.status === "due" || bill.status === "overdue";
			return (
				<motion.div
					animate={{ opacity: 1, x: 0 }}
					className="flex items-center justify-between rounded-xl bg-accent/30 p-4 transition-colors hover:bg-accent/50"
					initial={{ opacity: 0, x: mode === "upcoming" ? -10 : 10 }}
					key={bill.id}
					transition={{ delay: 0.05 + index * 0.05 }}
				>
					<div className="flex items-center gap-4">
						<div
							className={`rounded-xl p-3 ${isDue && mode === "upcoming" ? "bg-warning/10" : mode === "paid" ? "bg-success/10" : "bg-muted"}`}
						>
							{mode === "paid" ? (
								<CheckCircle2 className="h-5 w-5 text-success" />
							) : (
								<Icon
									className={`h-5 w-5 ${isDue ? "text-warning" : "text-muted-foreground"}`}
								/>
							)}
						</div>
						<div>
							<p className="font-medium">{bill.name}</p>
							<p className="text-muted-foreground text-sm">
								{mode === "paid" && bill.paidAt
									? `Paid ${new Date(bill.paidAt).toLocaleDateString()}`
									: `Due: ${new Date(bill.dueDate).toLocaleDateString()}`}
								{bill.reference ? ` · Ref: ${bill.reference}` : ""}
							</p>
						</div>
					</div>
					<div className="flex items-center gap-3">
						<div className="text-right">
							<p className="number-display font-semibold">
								${bill.amount.toFixed(2)}
							</p>
							<StatusBadge status={bill.status} />
						</div>
						{mode === "upcoming" ? (
							<>
								<Button
									className="bg-primary-gradient"
									onClick={() => setPayTarget(bill)}
									size="sm"
								>
									Pay Now
								</Button>
								<Button
									aria-label={`Delete ${bill.name}`}
									onClick={() => handleDelete(bill)}
									size="icon"
									variant="ghost"
								>
									<Trash2 className="size-4" />
								</Button>
							</>
						) : null}
					</div>
				</motion.div>
			);
		});

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center"
						initial={{ opacity: 1, y: 0 }}
					>
						<div>
							<h1 className="font-bold text-3xl tracking-tight">
								Bills & Utilities
							</h1>
							<p className="mt-1 text-muted-foreground">
								Pay your bills and manage recurring payments
							</p>
						</div>
						<Button onClick={() => setAddOpen(true)}>
							<Plus className="mr-2 size-4" />
							Add bill
						</Button>
					</motion.div>

					{/* Bill Categories */}
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 10 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardHeader className="pb-4">
								<CardTitle className="text-lg">Pay a Bill</CardTitle>
								<CardDescription>
									Pick a category for a one-off payment
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-4 gap-4 md:grid-cols-8 lg:grid-cols-10">
									{BILL_CATEGORIES.map((category) => (
										<motion.button
											className="flex flex-col items-center gap-2 rounded-xl p-4 transition-colors hover:bg-accent/50"
											key={category}
											onClick={() => openQuickPay(category)}
											whileHover={{ scale: 1.05 }}
											whileTap={{ scale: 0.95 }}
										>
											<div
												className={`rounded-xl p-3 ${categoryColor(category)}`}
											>
												{(() => {
													const Icon = categoryIcon(category);
													return <Icon className="h-5 w-5" />;
												})()}
											</div>
											<span className="text-center font-medium text-xs">
												{category}
											</span>
										</motion.button>
									))}
								</div>
							</CardContent>
						</Card>
					</motion.div>

					<div className="grid gap-6 lg:grid-cols-3">
						{/* Upcoming Bills */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="lg:col-span-2"
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.2 }}
						>
							<Card className="border-border/50 bg-card-gradient shadow-card">
								<CardHeader className="flex flex-row items-center justify-between pb-4">
									<div>
										<CardTitle className="flex items-center gap-2 text-lg">
											<Clock className="h-5 w-5 text-warning" />
											Upcoming Bills
										</CardTitle>
										<p className="mt-1 text-muted-foreground text-sm">
											Total due:{" "}
											<span className="font-semibold text-warning">
												${totalDue.toFixed(2)}
											</span>
										</p>
									</div>
									<div className="relative hidden w-64 md:block">
										<Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 text-muted-foreground" />
										<Input
											className="bg-muted/50 pl-10"
											onChange={(e) => setSearch(e.target.value)}
											placeholder="Search bills..."
											value={search}
										/>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									{isPending ? (
										<>
											<Skeleton className="h-20 w-full" />
											<Skeleton className="h-20 w-full" />
										</>
									) : isError ? (
										<div className="py-8 text-center">
											<p className="mb-3 text-muted-foreground">
												Failed to load bills.
											</p>
											<Button onClick={() => void refetch()} variant="outline">
												Retry
											</Button>
										</div>
									) : visibleUnpaid.length === 0 ? (
										<p className="py-8 text-center text-muted-foreground">
											{query
												? "No bills match your search."
												: "No bills yet, add one or pay from a category above."}
										</p>
									) : (
										listRows(visibleUnpaid, "upcoming")
									)}
								</CardContent>
							</Card>
						</motion.div>

						{/* Payment History */}
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.3 }}
						>
							<Card className="border-border/50 bg-card-gradient shadow-card">
								<CardHeader className="pb-4">
									<CardTitle className="flex items-center gap-2 text-lg">
										<CheckCircle2 className="h-5 w-5 text-success" />
										Recently Paid
									</CardTitle>
								</CardHeader>
								<CardContent className="space-y-4">
									{isPending ? (
										<>
											<Skeleton className="h-14 w-full" />
											<Skeleton className="h-14 w-full" />
										</>
									) : paidBills.length === 0 ? (
										<p className="py-4 text-center text-muted-foreground">
											No bill payments yet.
										</p>
									) : (
										listRows(paidBills.slice(0, 5), "paid")
									)}
									<Link
										className={`${buttonVariants({ variant: "ghost" })} w-full text-primary`}
										to="/dashboard/transactions"
									>
										View All History
									</Link>
								</CardContent>
							</Card>
						</motion.div>
					</div>
				</main>

				{/* Quick-pay dialog */}
				<Dialog onOpenChange={setQuickOpen} open={quickOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Pay a bill</DialogTitle>
							<DialogDescription>
								One-off payment in the {quickCategory} category.
							</DialogDescription>
						</DialogHeader>
						<form className="space-y-4" onSubmit={handleQuickPay}>
							<div className="space-y-2">
								<Label htmlFor="quick-name">Biller name (optional)</Label>
								<Input
									id="quick-name"
									onChange={(e) => setQuickName(e.target.value)}
									placeholder={quickCategory}
									value={quickName}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="quick-amount">Amount</Label>
									<Input
										className="bg-muted/50"
										id="quick-amount"
										min="0.01"
										onChange={(e) => setQuickAmount(e.target.value)}
										placeholder="0.00"
										required
										step="0.01"
										type="number"
										value={quickAmount}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="quick-ref">Account / ref (optional)</Label>
									<Input
										className="bg-muted/50"
										id="quick-ref"
										maxLength={60}
										onChange={(e) => setQuickReference(e.target.value)}
										value={quickReference}
									/>
								</div>
							</div>
							<div className="space-y-2">
								<Label>Pay from</Label>
								{walletSelect}
							</div>
							<DialogFooter>
								<Button
									onClick={() => setQuickOpen(false)}
									type="button"
									variant="ghost"
								>
									Cancel
								</Button>
								<Button
									className="bg-primary-gradient"
									disabled={quickPay.isPending}
									type="submit"
								>
									{quickPay.isPending ? "Paying…" : "Pay now"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				{/* Scheduled pay dialog */}
				<Dialog
					onOpenChange={(open) => {
						if (!open) setPayTarget(null);
					}}
					open={payTarget !== null}
				>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Pay {payTarget?.name}</DialogTitle>
							<DialogDescription>
								{payTarget
									? `Due ${new Date(payTarget.dueDate).toLocaleDateString()} · $${payTarget.amount.toFixed(2)}`
									: ""}
							</DialogDescription>
						</DialogHeader>
						<form className="space-y-4" onSubmit={handlePayScheduled}>
							<div className="space-y-2">
								<Label>Pay from</Label>
								{walletSelect}
							</div>
							<DialogFooter>
								<Button
									onClick={() => setPayTarget(null)}
									type="button"
									variant="ghost"
								>
									Cancel
								</Button>
								<Button
									className="bg-primary-gradient"
									disabled={payBill.isPending}
									type="submit"
								>
									{payBill.isPending
										? "Paying…"
										: `Pay $${(payTarget?.amount ?? 0).toFixed(2)}`}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>

				{/* Add-bill dialog */}
				<Dialog onOpenChange={setAddOpen} open={addOpen}>
					<DialogContent>
						<DialogHeader>
							<DialogTitle>Add a bill</DialogTitle>
							<DialogDescription>
								Schedule a bill so you can pay it later.
							</DialogDescription>
						</DialogHeader>
						<form className="space-y-4" onSubmit={handleAddBill}>
							<div className="space-y-2">
								<Label htmlFor="add-name">Biller name</Label>
								<Input
									id="add-name"
									maxLength={100}
									onChange={(e) => setAddName(e.target.value)}
									placeholder="Electric Company"
									required
									value={addName}
								/>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label>Category</Label>
									<Select
										onValueChange={(value) => {
											if (value) setAddCategory(value);
										}}
										value={addCategory}
									>
										<SelectTrigger className="bg-muted/50">
											<SelectValue />
										</SelectTrigger>
										<SelectContent>
											{BILL_CATEGORIES.map((category) => (
												<SelectItem key={category} value={category}>
													{category}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</div>
								<div className="space-y-2">
									<Label htmlFor="add-amount">Amount</Label>
									<Input
										className="bg-muted/50"
										id="add-amount"
										min="0.01"
										onChange={(e) => setAddAmount(e.target.value)}
										required
										step="0.01"
										type="number"
										value={addAmount}
									/>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="add-due">Due date</Label>
									<Input
										className="bg-muted/50"
										id="add-due"
										onChange={(e) => setAddDueDate(e.target.value)}
										required
										type="date"
										value={addDueDate}
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="add-ref">Account / ref (optional)</Label>
									<Input
										className="bg-muted/50"
										id="add-ref"
										maxLength={60}
										onChange={(e) => setAddReference(e.target.value)}
										value={addReference}
									/>
								</div>
							</div>
							<DialogFooter>
								<Button
									onClick={() => setAddOpen(false)}
									type="button"
									variant="ghost"
								>
									Cancel
								</Button>
								<Button disabled={createBill.isPending} type="submit">
									{createBill.isPending ? "Adding…" : "Add bill"}
								</Button>
							</DialogFooter>
						</form>
					</DialogContent>
				</Dialog>
			</div>
		</DashboardLayout>
	);
}
