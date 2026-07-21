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

const actions = [
	{ icon: Send, label: "Send Money", color: "bg-primary/10 text-primary" },
	{
		icon: ArrowDownToLine,
		label: "Request",
		color: "bg-success/10 text-success",
	},
	{ icon: CreditCard, label: "Cards", color: "bg-warning/10 text-warning" },
	{ icon: Smartphone, label: "Top Up", color: "bg-primary/10 text-primary" },
	{
		icon: Receipt,
		label: "Pay Bills",
		color: "bg-muted text-muted-foreground",
	},
	{ icon: RefreshCw, label: "Exchange", color: "bg-success/10 text-success" },
];

export function QuickActions() {
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
						{actions.map((action, index) => (
							<motion.button
								className="group flex flex-col items-center gap-3 rounded-xl p-4 transition-colors hover:bg-accent/50"
								key={action.label}
								whileHover={{ scale: 1.05 }}
								whileTap={{ scale: 0.95 }}
							>
								<div
									className={`rounded-2xl p-4 ${action.color} transition-transform group-hover:scale-110`}
								>
									<action.icon className="h-5 w-5" />
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
