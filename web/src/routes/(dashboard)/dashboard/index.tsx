import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowDownLeft,
	ArrowUpRight,
	Clock,
	Wallet as WalletIcon,
} from "lucide-react";
import { motion } from "motion/react";

import { AccountsList } from "@/components/user-dashboard/AccountsList";
import { BalanceCard } from "@/components/user-dashboard/BalanceCard";
import { KPICard } from "@/components/user-dashboard/KPICard";
import { QuickActions } from "@/components/user-dashboard/QuickActions";
import { SpendingChart } from "@/components/user-dashboard/SpendingChart";
import { TransactionsTable } from "@/components/user-dashboard/TransactionsTable";
import { useIncomingMoneyRequests } from "@/hooks/useMoneyRequests";
import { useTransactions } from "@/hooks/useTransactions";
import { useWallets } from "@/hooks/useWallets";
import DashboardLayout from "@/layout/DashboardLayout";
import { useAuthStore } from "@/lib/authStore";

export const Route = createFileRoute("/(dashboard)/dashboard/")({
	component: DashboardPage,
});

function formatCurrency(amount: number, currency: string) {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency,
	}).format(amount);
}

function DashboardPage() {
	const user = useAuthStore((s) => s.user);

	const { data: wallets, isLoading: walletsLoading } = useWallets();
	const { data: txData, isLoading: txLoading } = useTransactions({
		page: 1,
		pageSize: 100, // fetched client-side so we can derive "this month" stats below
	});
	// pageSize: 1 here — we only need totalCount, not the actual items
	const { data: incomingRequests } = useIncomingMoneyRequests(1, 1);

	const isLoading = walletsLoading || txLoading;

	if (isLoading) {
		return (
			<DashboardLayout>
				<div className="flex min-h-screen items-center justify-center">
					<p className="text-muted-foreground">Loading your dashboard...</p>
				</div>
			</DashboardLayout>
		);
	}

	// Wallets are ordered by CreatedAt on the backend, so [0] is the
	// default wallet created at registration. Currencies aren't summed
	// together (USD + NGN can't be added meaningfully) — the hero
	// balance and "this month" stats are scoped to this one currency.
	const primaryWallet = wallets?.[0];
	const currency = primaryWallet?.currencyCode ?? "USD";
	const totalBalance = primaryWallet?.balance ?? 0;

	const now = new Date();
	const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
	const thisMonthTx = (txData?.items ?? []).filter(
		(t) =>
			t.currency === currency &&
			t.status === "Completed" &&
			new Date(t.createdAt) >= startOfMonth,
	);
	const moneyIn = thisMonthTx
		.filter((t) => t.direction === "incoming")
		.reduce((sum, t) => sum + t.amount, 0);
	const moneyOut = thisMonthTx
		.filter((t) => t.direction === "outgoing")
		.reduce((sum, t) => sum + t.amount, 0);

	const kpiData = [
		{
			title: "Wallets",
			value: `${wallets?.length ?? 0}`,
			change: wallets && wallets.length > 1 ? "multi-currency" : "",
			changeType: "neutral" as const,
			icon: WalletIcon,
			description: "active wallets",
		},
		{
			title: "Money In",
			value: formatCurrency(moneyIn, currency),
			change: "this month",
			changeType: "positive" as const,
			icon: ArrowDownLeft,
			description: "received",
		},
		{
			title: "Money Out",
			value: formatCurrency(moneyOut, currency),
			change: "this month",
			changeType: "negative" as const,
			icon: ArrowUpRight,
			description: "sent",
		},
		{
			title: "Pending Requests",
			value: `${incomingRequests?.totalCount ?? 0}`,
			change: "awaiting you",
			changeType: "neutral" as const,
			icon: Clock,
			description: "money requests",
		},
	];

	const tableTransactions = (txData?.items ?? []).slice(0, 5).map((t) => ({
		id: t.id,
		name: t.description || t.type,
		// Backend doesn't return counterparty name/email in the list view
		// (only transaction detail has that). Repurposing this slot to
		// show currency + type instead.
		email: `${t.currency} · ${t.type}`,
		amount: t.amount,
		status: (t.status.toLowerCase() === "reversed"
			? "failed"
			: t.status.toLowerCase()) as
			| "completed"
			| "pending"
			| "processing"
			| "failed",
		date: t.createdAt,
		type: t.direction,
		currency: t.currency,
	}));

	const accounts = (wallets ?? []).map((w) => ({
		id: w.id,
		name: `${w.currencyCode} Wallet`,
		type: "checking" as const,
		balance: w.balance,
		lastFour: w.id.slice(-4).toUpperCase(),
		currency: w.currencyCode,
	}));

	const hour = now.getHours();
	const greeting =
		hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="mb-8"
						initial={{ opacity: 0, y: 10 }}
					>
						<h1 className="font-bold text-3xl tracking-tight">
							{greeting}, {user?.firstName ?? "there"} 👋
						</h1>
						<p className="mt-1 text-muted-foreground">
							Here's what's happening with your finances today.
						</p>
					</motion.div>

					<div className="mb-6 grid gap-6 lg:grid-cols-5">
						<div className="lg:col-span-3">
							<BalanceCard totalBalance={totalBalance} currency={currency} />
						</div>
						<div className="lg:col-span-2">
							<QuickActions />
						</div>
					</div>

					<div className="mb-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
						{kpiData.map((kpi, index) => (
							<KPICard key={kpi.title} {...kpi} delay={0.1 + index * 0.05} />
						))}
					</div>

					<div className="grid gap-6 lg:grid-cols-7">
						<div className="lg:col-span-4">
							<TransactionsTable transactions={tableTransactions} />
						</div>

						<div className="space-y-6 lg:col-span-3">
							<AccountsList accounts={accounts} />
							{/* Still mock data — no analytics/spending-breakdown backend yet */}
							<SpendingChart />
						</div>
					</div>
				</main>
			</div>
		</DashboardLayout>
	);
}
