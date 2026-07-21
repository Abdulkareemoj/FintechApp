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
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import DashboardLayout from "@/layout/DashboardLayout";

const cardsData = [
	{
		id: "1",
		type: "Visa Debit",
		lastFour: "4567",
		status: "active",
		balance: 15_450.2,
		limit: 25_000,
		expiryDate: "12/26",
		cardHolder: "JOHN DOE",
		color: "from-primary to-emerald-400",
	},
	{
		id: "2",
		type: "Mastercard Credit",
		lastFour: "9012",
		status: "frozen",
		balance: -1200.0,
		limit: 10_000,
		expiryDate: "08/25",
		cardHolder: "JOHN DOE",
		color: "from-slate-600 to-slate-800",
	},
	{
		id: "3",
		type: "Virtual Card",
		lastFour: "3456",
		status: "active",
		balance: 500.0,
		limit: 2000,
		expiryDate: "03/27",
		cardHolder: "JOHN DOE",
		color: "from-primary to-blue-400",
	},
];
export const Route = createFileRoute("/(dashboard)/dashboard/cards")({
	component: CardPage,
});

function CardPage() {
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

	const formatBalance = (amount: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency: "USD",
		}).format(Math.abs(amount));

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				{/* Main Content */}
				<main className="mx-auto space-y-6 px-6 py-8">
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
						<Button className="bg-primary-gradient">
							<PlusCircle className="mr-2 h-4 w-4" />
							Order New Card
						</Button>
					</motion.div>

					{/* Cards Grid */}
					<div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
						{cardsData.map((card, index) => {
							const isHidden = hiddenCards.has(card.id);
							const isFrozen = card.status === "frozen";
							const usagePercent = (Math.abs(card.balance) / card.limit) * 100;

							return (
								<motion.div
									animate={{ opacity: 1, y: 0 }}
									className="space-y-4"
									initial={{ opacity: 0, y: 20 }}
									key={card.id}
									transition={{ delay: index * 0.1 }}
								>
									{/* Card Visual */}
									<div
										className={`relative aspect-[1.6/1] rounded-2xl bg-gradient-to-br ${card.color} overflow-hidden p-6 shadow-elevated ${isFrozen ? "opacity-60" : ""}`}
									>
										{/* Background Pattern */}
										<div className="absolute inset-0 opacity-10">
											<div className="-right-8 -top-8 absolute h-40 w-40 rounded-full bg-white/20" />
											<div className="-left-8 -bottom-8 absolute h-32 w-32 rounded-full bg-white/20" />
										</div>

										{/* Frozen Overlay */}
										{isFrozen && (
											<div className="absolute inset-0 flex items-center justify-center bg-background/30 backdrop-blur-sm">
												<div className="flex items-center gap-2 rounded-full bg-background/80 px-4 py-2">
													<Snowflake className="h-5 w-5 text-primary" />
													<span className="font-medium">Card Frozen</span>
												</div>
											</div>
										)}

										{/* Card Content */}
										<div className="relative flex h-full flex-col justify-between text-white">
											<div className="flex items-start justify-between">
												<CreditCard className="h-10 w-10" />
												<Badge
													className="border-0 bg-white/20 text-white"
													variant="secondary"
												>
													{card.type}
												</Badge>
											</div>

											<div className="space-y-4">
												<p className="font-mono text-2xl tracking-widest">
													{isHidden ? "•••• •••• •••• " : "•••• •••• •••• "}
													{card.lastFour}
												</p>
												<div className="flex items-end justify-between">
													<div>
														<p className="text-xs opacity-70">Card Holder</p>
														<p className="font-medium">{card.cardHolder}</p>
													</div>
													<div className="text-right">
														<p className="text-xs opacity-70">Expires</p>
														<p className="font-medium">{card.expiryDate}</p>
													</div>
												</div>
											</div>
										</div>
									</div>

									{/* Card Details */}
									<Card className="border-border/50 bg-card-gradient shadow-card">
										<CardContent className="space-y-4 p-4">
											<div className="flex items-center justify-between">
												<div>
													<p className="text-muted-foreground text-sm">
														{card.balance < 0
															? "Amount Due"
															: "Available Balance"}
													</p>
													<p
														className={`number-display font-bold text-2xl ${card.balance < 0 ? "text-destructive" : ""}`}
													>
														{card.balance < 0 ? "-" : ""}
														{formatBalance(card.balance)}
													</p>
												</div>
												<Button
													onClick={() => toggleCardVisibility(card.id)}
													size="icon"
													variant="ghost"
												>
													{isHidden ? (
														<EyeOff className="h-4 w-4" />
													) : (
														<Eye className="h-4 w-4" />
													)}
												</Button>
											</div>

											{/* Credit Limit Progress */}
											<div className="space-y-2">
												<div className="flex justify-between text-sm">
													<span className="text-muted-foreground">
														Credit Used
													</span>
													<span>{usagePercent.toFixed(0)}%</span>
												</div>
												<Progress className="h-2" value={usagePercent} />
												<p className="text-muted-foreground text-xs">
													Limit: {formatBalance(card.limit)}
												</p>
											</div>

											{/* Card Actions */}
											<div className="flex gap-2 pt-2">
												<Button
													className="flex-1"
													size="sm"
													variant="secondary"
												>
													{isFrozen ? (
														<>
															<Unlock className="mr-1 h-3 w-3" />
															Unfreeze
														</>
													) : (
														<>
															<Lock className="mr-1 h-3 w-3" />
															Freeze
														</>
													)}
												</Button>
												<Button size="sm" variant="outline">
													<Settings2 className="h-3 w-3" />
												</Button>
												<Button
													className="text-destructive hover:text-destructive"
													size="sm"
													variant="outline"
												>
													<Trash2 className="h-3 w-3" />
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
							<Card className="h-full min-h-[400px] border-2 border-border border-dashed transition-colors hover:border-primary/50">
								<CardContent className="flex h-full flex-col items-center justify-center p-6">
									<Button
										className="flex h-auto flex-col gap-3 py-8"
										variant="ghost"
									>
										<div className="rounded-full bg-muted p-4">
											<PlusCircle className="h-6 w-6 text-muted-foreground" />
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
				</main>
			</div>
		</DashboardLayout>
	);
}
