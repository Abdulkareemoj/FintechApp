import { createFileRoute } from "@tanstack/react-router";
import {
	ExternalLink,
	Eye,
	EyeOff,
	MoreVertical,
	PiggyBank,
	PlusCircle,
	Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
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
import { Spinner } from "@/components/ui/spinner";
import { useWallets } from "@/hooks/useWallets";
import DashboardLayout from "@/layout/DashboardLayout";

const accountIcons: Record<string, typeof Wallet> = {
	USD: Wallet,
	EUR: PiggyBank,
	GBP: PiggyBank,
};

export const Route = createFileRoute("/(dashboard)/dashboard/accounts")({
	component: AccountsPage,
});

function AccountsPage() {
	const { data: wallets, isPending, isError, refetch } = useWallets();
	const [hiddenBalances, setHiddenBalances] = useState<Set<string>>(new Set());

	const toggleBalance = (id: string) => {
		const newSet = new Set(hiddenBalances);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		setHiddenBalances(newSet);
	};

	const formatBalance = (amount: number, currency: string) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
		}).format(amount);

	const accounts = wallets ?? [];
	const primaryCurrency = accounts[0]?.currencyCode ?? "USD";
	const totalBalance = accounts.reduce(
		(sum, acc) => sum + (acc.balance ?? 0),
		0,
	);

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				{/* Main Content */}
				<main className="mx-auto flex flex-col gap-6 px-6 py-8">
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center"
						initial={{ opacity: 0, y: 10 }}
					>
						<div>
							<h1 className="font-bold text-3xl tracking-tight">My Accounts</h1>
							<p className="mt-1 text-muted-foreground">
								Manage all your connected accounts
							</p>
						</div>
						<Button className="" disabled>
							<PlusCircle data-icon />
							Add New Account
						</Button>
					</motion.div>

					{/* Total Balance Card */}
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardContent className="p-6">
								<div className="flex items-center justify-between">
									<div>
										<p className="text-muted-foreground text-sm">
											Total Balance Across All Accounts
										</p>
										<p className="number-display mt-2 font-bold text-4xl">
											<AnimatedNumber
												value={formatBalance(totalBalance, primaryCurrency)}
											/>
										</p>
									</div>
									<div className="hidden gap-4 md:flex">
										<div className="text-center">
											<p className="font-bold text-2xl">
												{accounts.filter((a) => a.balance > 0).length}
											</p>
											<p className="text-muted-foreground text-xs">
												Funded Wallets
											</p>
										</div>
										<div className="text-center">
											<p className="font-bold text-2xl">{accounts.length}</p>
											<p className="text-muted-foreground text-xs">Accounts</p>
										</div>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>

					{/* Accounts Grid */}
					{isPending ? (
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardContent className="flex justify-center p-8 text-muted-foreground">
								<span className="inline-flex items-center gap-2">
									<Spinner />
									Loading accounts…
								</span>
							</CardContent>
						</Card>
					) : isError ? (
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardContent className="p-8">
								<Empty className="border-0">
									<EmptyHeader>
										<EmptyTitle>Couldn't load accounts</EmptyTitle>
										<EmptyDescription>
											Something went wrong while fetching your wallets.
										</EmptyDescription>
									</EmptyHeader>
									<Button onClick={() => refetch()} variant="outline">
										Retry
									</Button>
								</Empty>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
							{accounts.map((account, index) => {
								const Icon = accountIcons[account.currencyCode] || Wallet;
								const isHidden = hiddenBalances.has(account.id);

								return (
									<motion.div
										animate={{ opacity: 1, y: 0 }}
										initial={{ opacity: 0, y: 20 }}
										key={account.id}
										transition={{ delay: 0.1 + index * 0.05 }}
									>
										<Card className="group border-border/50 bg-card-gradient shadow-card transition-shadow duration-300 hover:shadow-elevated">
											<CardHeader className="flex flex-row items-start justify-between pb-2">
												<div className="flex items-center gap-3">
													<div className="rounded-xl bg-primary/10 p-3">
														<Icon className="size-5 text-primary" />
													</div>
													<div>
														<CardTitle className="text-base">
															{account.currencyCode} Account
														</CardTitle>
														<p className="text-muted-foreground text-sm">
															•••• {account.id.slice(-4)}
														</p>
													</div>
												</div>
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
														<DropdownMenuItem disabled>
															View Details
														</DropdownMenuItem>
														<DropdownMenuItem disabled>
															Download Statement
														</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
											</CardHeader>
											<CardContent className="pt-4">
												<div className="flex items-center justify-between">
													<div>
														<p className="mb-1 text-muted-foreground text-sm">
															Available Balance
														</p>
														<p className="number-display font-bold text-3xl">
															{isHidden ? (
																"••••••"
															) : (
																<AnimatedNumber
																	value={formatBalance(
																		account.balance,
																		account.currencyCode,
																	)}
																/>
															)}
														</p>
													</div>
													<Button
														onClick={() => toggleBalance(account.id)}
														size="icon"
														variant="ghost"
													>
														{isHidden ? (
															<EyeOff data-icon />
														) : (
															<Eye data-icon />
														)}
													</Button>
												</div>
												<div className="mt-4 flex gap-2">
													<Button
														className="flex-1"
														size="sm"
														variant="secondary"
														disabled
													>
														Transfer
													</Button>
													<Button
														className="flex-1"
														size="sm"
														variant="outline"
														disabled
													>
														<ExternalLink data-icon />
														Details
													</Button>
												</div>
											</CardContent>
										</Card>
									</motion.div>
								);
							})}

							{/* Add Account Card */}
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								initial={{ opacity: 0, y: 20 }}
								transition={{ delay: 0.3 }}
							>
								<Card className="h-full min-h-[220px] border-2 border-border border-dashed">
									<CardContent className="flex h-full flex-col items-center justify-center p-6">
										<Button
											className="flex h-auto flex-col gap-3 py-8"
											variant="ghost"
											disabled
										>
											<div className="rounded-full bg-muted p-4">
												<PlusCircle className="size-6 text-muted-foreground" />
											</div>
											<span className="font-medium">Link External Account</span>
											<span className="text-muted-foreground text-xs">
												Connect your bank accounts
											</span>
										</Button>
									</CardContent>
								</Card>
							</motion.div>
						</div>
					)}
				</main>
			</div>
		</DashboardLayout>
	);
}
