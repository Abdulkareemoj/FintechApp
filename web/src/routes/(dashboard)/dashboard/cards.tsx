import { createFileRoute } from "@tanstack/react-router";
import {
	CreditCard,
	Eye,
	EyeOff,
	Lock,
	PlusCircle,
	Settings2,
	Snowflake,
	Trash2,
	Unlock,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import {
	useCards,
	useDeleteCard,
	useFreezeCard,
	useUnfreezeCard,
} from "@/hooks/useCards";
import DashboardLayout from "@/layout/DashboardLayout";
import type { Card as BankCard } from "@/lib/api/cards";
import { cn } from "@/lib/utils";

function humanize(value: string) {
	if (!value) return "—";
	return value
		.toLowerCase()
		.split(/[\s_-]+/)
		.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
		.join(" ");
}

function cardColor(card: BankCard) {
	const type = card.cardType?.toLowerCase() ?? "";
	if (type.includes("virtual")) return "from-primary to-blue-400";
	if (type.includes("credit")) return "from-slate-600 to-slate-800";
	return "from-primary to-emerald-400";
}

function expiryLabel(card: BankCard) {
	const year = (card.expiryYear ?? "").padStart(2, "0");
	return `${card.expiryMonth ?? "—"}/${year.length > 2 ? year.slice(-2) : year}`;
}

export const Route = createFileRoute("/(dashboard)/dashboard/cards")({
	component: CardPage,
});

function CardPage() {
	const { data: cards, isPending, isError, refetch } = useCards();
	const freezeCard = useFreezeCard();
	const unfreezeCard = useUnfreezeCard();
	const deleteCard = useDeleteCard();
	const [hiddenCards, setHiddenCards] = useState<Set<string>>(new Set());

	const toggleCardVisibility = (id: string) => {
		const newSet = new Set(hiddenCards);
		if (newSet.has(id)) {
			newSet.delete(id);
		} else {
			newSet.add(id);
		}
		setHiddenCards(newSet);
	};

	const cardList: BankCard[] = (cards as BankCard[] | undefined) ?? [];

	const formatMoney = (amount: number, currency: string) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: currency ?? "USD",
		}).format(amount ?? 0);

	const handleToggleFreeze = async (card: BankCard) => {
		const frozen = card.status?.toLowerCase().includes("frozen");
		try {
			if (frozen) {
				await unfreezeCard.mutateAsync(card.id);
				toast.success("Card unfrozen");
			} else {
				await freezeCard.mutateAsync(card.id);
				toast.success("Card frozen");
			}
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Action failed");
		}
	};

	const handleDelete = (card: BankCard) => {
		if (!window.confirm(`Delete card •••• ${card.lastFourDigits}?`)) return;
		deleteCard.mutate(card.id, {
			onSuccess: () => toast.success("Card deleted"),
			onError: (err) =>
				toast.error(err instanceof Error ? err.message : "Delete failed"),
		});
	};

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
							<h1 className="font-bold text-3xl tracking-tight">My Cards</h1>
							<p className="mt-1 text-muted-foreground">
								Manage your physical and virtual cards
							</p>
						</div>
						<Button className="bg-primary-gradient" disabled>
							<PlusCircle data-icon />
							Order New Card
						</Button>
					</motion.div>

					{/* Cards Grid */}
					{isPending ? (
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardContent className="flex justify-center p-8 text-muted-foreground">
								<span className="inline-flex items-center gap-2">
									<Spinner />
									Loading cards…
								</span>
							</CardContent>
						</Card>
					) : isError ? (
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardContent className="p-8">
								<Empty className="border-0">
									<EmptyHeader>
										<EmptyTitle>Couldn't load cards</EmptyTitle>
										<EmptyDescription>
											Something went wrong while fetching your cards.
										</EmptyDescription>
									</EmptyHeader>
									<Button onClick={() => refetch()} variant="outline">
										Retry
									</Button>
								</Empty>
							</CardContent>
						</Card>
					) : (
						<div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
							{cardList.map((card, index) => {
								const isHidden = hiddenCards.has(card.id);
								const isFrozen = card.status?.toLowerCase().includes("frozen");
								const hasLimit = (card.spendingLimit ?? 0) > 0;

								return (
									<motion.div
										animate={{ opacity: 1, y: 0 }}
										className="flex flex-col gap-4"
										initial={{ opacity: 0, y: 20 }}
										key={card.id}
										transition={{ delay: index * 0.1 }}
									>
										{/* Card Visual */}
										<div
											className={cn(
												"relative aspect-[1.6/1] rounded-2xl bg-gradient-to-br overflow-hidden p-6 shadow-elevated",
												cardColor(card),
												isFrozen && "opacity-60",
											)}
										>
											{/* Background Pattern */}
											<div className="absolute inset-0 opacity-10">
												<div className="-right-8 -top-8 absolute size-40 rounded-full bg-white/20" />
												<div className="-left-8 -bottom-8 absolute size-32 rounded-full bg-white/20" />
											</div>

											{/* Frozen Overlay */}
											{isFrozen && (
												<div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
													<div className="flex items-center gap-2 rounded-full bg-background/80 px-4 py-2">
														<Snowflake className="size-5 text-primary" />
														<span className="font-medium">Card Frozen</span>
													</div>
												</div>
											)}

											{/* Card Content */}
											<div className="relative flex h-full flex-col justify-between text-white">
												<div className="flex items-start justify-between">
													<CreditCard className="size-10" />
													<Badge
														className="border-0 bg-white/20 text-white"
														variant="secondary"
													>
														{humanize(card.cardType)}
													</Badge>
												</div>

												<div className="flex flex-col gap-4">
													<p className="font-mono text-2xl tracking-widest">
														{isHidden ? "•••• •••• •••• " : "•••• •••• •••• "}
														{card.lastFourDigits}
													</p>
													<div className="flex items-end justify-between">
														<div>
															<p className="text-xs opacity-70">Card Holder</p>
															<p className="font-medium">
																{card.cardHolderName}
															</p>
														</div>
														<div className="text-right">
															<p className="text-xs opacity-70">Expires</p>
															<p className="font-medium">{expiryLabel(card)}</p>
														</div>
													</div>
												</div>
											</div>
										</div>

										{/* Card Details */}
										<Card className="border-border/50 bg-card-gradient shadow-card">
											<CardContent className="flex flex-col gap-4 p-4">
												<div className="flex items-center justify-between">
													<div>
														<p className="text-muted-foreground text-sm">
															{card.cardType?.toLowerCase().includes("credit")
																? "Credit Limit"
																: "Card Status"}
														</p>
														<p className="number-display mt-0.5 font-bold text-2xl">
															{humanize(card.status)}
														</p>
													</div>
													<Button
														onClick={() => toggleCardVisibility(card.id)}
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

												{/* Card Limits */}
												{hasLimit && (
													<div className="flex flex-col gap-1.5">
														<div className="flex justify-between text-sm">
															<span className="text-muted-foreground">
																Spending Limit
															</span>
															<span className="number-display">
																{formatMoney(
																	card.spendingLimit,
																	card.currencyCode,
																)}
															</span>
														</div>
														<div className="flex justify-between text-sm">
															<span className="text-muted-foreground">
																Daily Limit
															</span>
															<span className="number-display">
																{formatMoney(
																	card.dailyLimit ?? 0,
																	card.currencyCode,
																)}
															</span>
														</div>
														<div className="flex justify-between text-sm">
															<span className="text-muted-foreground">
																Monthly Limit
															</span>
															<span className="number-display">
																{formatMoney(
																	card.monthlyLimit ?? 0,
																	card.currencyCode,
																)}
															</span>
														</div>
													</div>
												)}

												{/* Card Actions */}
												<div className="flex gap-2 pt-2">
													<Button
														className="flex-1"
														disabled={
															freezeCard.isPending || unfreezeCard.isPending
														}
														onClick={() => handleToggleFreeze(card)}
														size="sm"
														variant="secondary"
													>
														{isFrozen ? (
															<>
																<Unlock data-icon />
																Unfreeze
															</>
														) : (
															<>
																<Lock data-icon />
																Freeze
															</>
														)}
													</Button>
													<Button size="sm" variant="outline" disabled>
														<Settings2 data-icon />
													</Button>
													<Button
														className="text-destructive hover:text-destructive"
														disabled={deleteCard.isPending}
														onClick={() => handleDelete(card)}
														size="sm"
														variant="outline"
													>
														<Trash2 data-icon />
													</Button>
												</div>
											</CardContent>
										</Card>
									</motion.div>
								);
							})}

							{/* Add Virtual Card */}
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								initial={{ opacity: 0, y: 20 }}
								transition={{ delay: 0.3 }}
							>
								<Card className="h-full min-h-[400px] border-2 border-border border-dashed">
									<CardContent className="flex h-full flex-col items-center justify-center p-6">
										<Button
											className="flex h-auto flex-col gap-3 py-8"
											variant="ghost"
											disabled
										>
											<div className="rounded-full bg-muted p-4">
												<PlusCircle className="size-6 text-muted-foreground" />
											</div>
											<span className="font-medium">Add Virtual Card</span>
											<span className="text-center text-muted-foreground text-xs">
												Create a virtual card for online purchases
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
