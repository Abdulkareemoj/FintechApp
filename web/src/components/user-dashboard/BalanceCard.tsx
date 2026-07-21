import { ArrowDownToLine, Eye, EyeOff, Plus, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

interface BalanceCardProps {
	totalBalance: number;
	currency?: string;
}

export function BalanceCard({
	totalBalance,
	currency = "USD",
}: BalanceCardProps) {
	const [isVisible, setIsVisible] = useState(true);

	const formatBalance = (amount: number) =>
		new Intl.NumberFormat("en-US", {
			style: "currency",
			currency,
			minimumFractionDigits: 2,
		}).format(amount);

	return (
		<motion.div
			animate={{ opacity: 1, scale: 1 }}
			initial={{ opacity: 0, scale: 0.95 }}
			transition={{ duration: 0.5 }}
		>
			<Card className="relative overflow-hidden border-0 shadow-elevated">
				{/* Gradient background */}
				<div className="absolute inset-0 bg-primary-gradient opacity-90" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(255,255,255,0.1)_0%,_transparent_50%)]" />

				{/* Decorative elements */}
				<div className="-right-20 -top-20 absolute h-64 w-64 rounded-full bg-white/5" />
				<div className="-left-10 -bottom-10 absolute h-40 w-40 rounded-full bg-white/5" />

				<CardContent className="relative p-8">
					<div className="mb-6 flex items-start justify-between">
						<div>
							<p className="mb-1 font-medium  text-sm">
								Total Balance
							</p>
							<div className="flex items-center gap-3">
								<h2 className="number-display font-bold text-4xl tracking-tight">
									{isVisible ? formatBalance(totalBalance) : "••••••••"}
								</h2>
								<button
									className="rounded-lg p-2 transition-colors hover:bg-white/10"
									onClick={() => setIsVisible(!isVisible)}
								>
									{isVisible ? (
										<Eye className="h-5 w-5 text-primary-foreground/70" />
									) : (
										<EyeOff className="h-5 w-5 text-primary-foreground/70" />
									)}
								</button>
							</div>
						</div>
					</div>

					<div className="flex gap-3">
						<Button
							className="flex-1 bg-primary-foreground font-semibold text-primary hover:bg-primary-foreground/90"
							size="lg"
						>
							<Send className="mr-2 h-4 w-4" />
							Send
						</Button>
						<Button
							className="flex-1 border-primary-foreground/30 bg-transparent font-semibold  hover:bg-white/10"
							size="lg"
							variant="outline"
						>
							<ArrowDownToLine className="mr-2 h-4 w-4" />
							Receive
						</Button>
						<Button
							className="border-primary-foreground/30 bg-transparent font-semibold text-primary-foreground hover:bg-white/10"
							size="lg"
							variant="outline"
						>
							<Plus className="h-4 w-4" />
						</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
