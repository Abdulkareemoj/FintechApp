import { useNavigate } from "@tanstack/react-router";
import {
	ArrowDownToLine,
	CreditCard,
	Receipt,
	RefreshCw,
	Send,
	Smartphone,
} from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const actions = [
	{
		icon: Send,
		label: "Send Money",
		color: "bg-primary/10 text-primary",
		to: "/dashboard/send-money",
	},
	{
		icon: ArrowDownToLine,
		label: "Request",
		color: "bg-success/10 text-success",
		to: "/dashboard/top-up",
	},
	{
		icon: CreditCard,
		label: "Cards",
		color: "bg-warning/10 text-warning",
		to: "/dashboard/cards",
	},
	{
		icon: Smartphone,
		label: "Top Up",
		color: "bg-primary/10 text-primary",
		to: "/dashboard/top-up",
	},
	{
		icon: Receipt,
		label: "Pay Bills",
		color: "bg-muted text-muted-foreground",
		to: "/dashboard/bills",
	},
	{
		icon: RefreshCw,
		label: "Exchange",
		color: "bg-success/10 text-success",
		to: null,
	},
] as const;

export function QuickActions() {
	const navigate = useNavigate();

	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			initial={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.4, delay: 0.15 }}
		>
			<Card className="border-border/50 bg-card-gradient shadow-card">
				<CardHeader className="pb-4">
					<CardTitle className="font-semibold text-lg">Quick Actions</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-3 gap-4">
						{actions.map((action) => (
							<motion.button
								className={cn(
									"group flex flex-col items-center gap-3 rounded-xl p-4 transition-colors hover:bg-accent/50",
									!action.to && "cursor-not-allowed opacity-50",
								)}
								disabled={!action.to}
								key={action.label}
								onClick={() => action.to && navigate({ to: action.to })}
								whileHover={action.to ? { scale: 1.05 } : undefined}
								whileTap={action.to ? { scale: 0.95 } : undefined}
							>
								<div
									className={cn(
										"rounded-2xl p-4 transition-transform group-hover:scale-110",
										action.color,
									)}
								>
									<action.icon className="size-5" />
								</div>
								<span className="font-medium text-muted-foreground text-sm transition-colors group-hover:text-foreground">
									{action.label}
								</span>
							</motion.button>
						))}
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
