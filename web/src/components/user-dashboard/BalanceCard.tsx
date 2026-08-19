import { ArrowDownToLine, Eye, EyeOff, Plus, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
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
							<p className="mb-1 font-medium  text-sm">Total Balance</p>
							<div className="flex items-center gap-3">
								<h2 className="number-display font-bold text-4xl tracking-tight">
									{isVisible ? (
										<AnimatedNumber value={formatBalance(totalBalance)} />
									) : (
										"••••••••"
									)}
								</h2>
								<Button
									type="button"
									className="rounded-lg p-2 transition-colors hover:bg-primary-foreground/10"
									onClick={() => setIsVisible(!isVisible)}
								>
									<span
										className="t-icon-swap"
										data-state={isVisible ? "a" : "b"}
									>
										<span className="t-icon" data-icon="a">
											<Eye className="size-5 text-primary-foreground/70" />
										</span>
										<span className="t-icon" data-icon="b">
											<EyeOff className="size-5 text-primary-foreground/70" />
										</span>
									</span>
								</button>
							</div>
						</div>
					</div>

					<div className="flex gap-3">
						<Button
							className="flex-1 bg-primary-foreground font-semibold text-primary hover:bg-primary-foreground/90"
							size="lg"
						>
							<Send data-icon />
							Send
						</Button>
						<Button
							className="flex-1 border-primary-foreground/30 bg-transparent font-semibold  hover:bg-white/10"
							size="lg"
							variant="outline"
						>
							<ArrowDownToLine data-icon />
							Receive
						</Button>
						<Button
							className="border-primary-foreground/30 bg-transparent font-semibold text-primary-foreground hover:bg-white/10"
							size="lg"
							variant="outline"
						>
							<Plus data-icon />
						</Button>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
