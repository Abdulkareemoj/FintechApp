import { type LucideIcon, TrendingDown, TrendingUp } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "@/components/ui/card";

interface KPICardProps {
	title: string;
	value: string;
	change: string;
	changeType: "positive" | "negative" | "neutral";
	icon: LucideIcon;
	description: string;
	delay?: number;
}

export function KPICard({
	title,
	value,
	change,
	changeType,
	icon: Icon,
	description,
	delay = 0,
}: KPICardProps) {
	return (
		<motion.div
			animate={{ opacity: 1, y: 0 }}
			initial={{ opacity: 0, y: 20 }}
			transition={{ duration: 0.4, delay }}
		>
			<Card className="group relative overflow-hidden border-border/50 bg-card-gradient shadow-card transition-all duration-300 hover:shadow-elevated">
				<div className="absolute inset-0 bg-primary-gradient opacity-0 transition-opacity duration-300 group-hover:opacity-5" />
				<CardContent className="p-6">
					<div className="flex items-start justify-between">
						<div className="space-y-1">
							<p className="font-medium text-muted-foreground text-sm">
								{title}
							</p>
							<p className="number-display font-bold text-3xl tracking-tight">
								{value}
							</p>
						</div>
						<div className="rounded-xl bg-primary/10 p-3 transition-colors group-hover:bg-primary/20">
							<Icon className="h-5 w-5 text-primary" />
						</div>
					</div>
					<div className="mt-4 flex items-center gap-2">
						<div
							className={`flex items-center gap-1 font-medium text-sm ${
								changeType === "positive"
									? "text-success"
									: changeType === "negative"
										? "text-destructive"
										: "text-muted-foreground"
							}`}
						>
							{changeType === "positive" ? (
								<TrendingUp className="h-4 w-4" />
							) : changeType === "negative" ? (
								<TrendingDown className="h-4 w-4" />
							) : null}
							{change}
						</div>
						<span className="text-muted-foreground text-xs">{description}</span>
					</div>
				</CardContent>
			</Card>
		</motion.div>
	);
}
