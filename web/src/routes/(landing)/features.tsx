import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRight,
	BarChart3,
	Bell,
	PiggyBank,
	Shield,
	Smartphone,
	TrendingUp,
	Wallet,
	Zap,
} from "lucide-react";
import { motion } from "motion/react";

import { Button } from "@/components/ui/button";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/features")({
	component: FeaturesPage,
});

function FeaturesPage() {
	const features = [
		{
			icon: Wallet,
			title: "Smart Budgeting",
			description:
				"Automatically categorize expenses and set smart budgets that adapt to your spending patterns.",
		},
		{
			icon: PiggyBank,
			title: "Goal-Based Saving",
			description:
				"Create multiple savings goals and watch your progress with beautiful visualizations.",
		},
		{
			icon: TrendingUp,
			title: "Investment Tracking",
			description:
				"Monitor your portfolio performance across multiple platforms in one unified dashboard.",
		},
		{
			icon: Bell,
			title: "Smart Alerts",
			description:
				"Get notified about unusual spending, upcoming bills, and goal milestones.",
		},
		{
			icon: Shield,
			title: "Bank-Level Security",
			description:
				"256-bit encryption, biometric authentication, and SOC 2 Type II compliance.",
		},
		{
			icon: Smartphone,
			title: "Mobile-First",
			description:
				"A beautiful, intuitive mobile app that puts your finances at your fingertips.",
		},
		{
			icon: BarChart3,
			title: "Advanced Analytics",
			description:
				"Detailed reports and insights that help you understand your financial behavior.",
		},
		{
			icon: Zap,
			title: "Instant Sync",
			description:
				"Connect to over 10,000 financial institutions with real-time transaction updates.",
		},
	];
	return (
		<LandingLayout>
			<main className="pt-24">
				{/* Hero */}
				<section className="py-20 lg:py-28 bg-soft-teal">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-center max-w-3xl mx-auto"
						>
							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
								Powerful <span className="italic-accent">features</span> for
								your financial success
							</h1>
							<p className="text-lg text-muted-foreground mb-8">
								Everything you need to budget, save, invest, and grow—all in one
								beautifully designed platform.
							</p>
							<Button variant="hero" size="lg" asChild>
								<Link to="/signup">
									Start for free
									<ArrowRight className="w-4 h-4" />
								</Link>
							</Button>
						</motion.div>
					</div>
				</section>

				{/* Features Grid */}
				<section className="py-20 bg-background">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
							{features.map((feature, index) => (
								<motion.div
									key={feature.title}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.05 }}
									className="bg-card rounded-2xl p-6 shadow-card hover:shadow-lg transition-shadow"
								>
									<div className="w-12 h-12 rounded-xl bg-teal-100 flex items-center justify-center mb-4">
										<feature.icon className="w-6 h-6 text-primary" />
									</div>
									<h3 className="text-lg font-semibold text-foreground mb-2">
										{feature.title}
									</h3>
									<p className="text-sm text-muted-foreground leading-relaxed">
										{feature.description}
									</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="py-20 bg-secondary/30">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-center max-w-2xl mx-auto"
						>
							<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
								Ready to take <span className="italic-accent">control</span>?
							</h2>
							<p className="text-muted-foreground mb-8">
								Join thousands of users who have transformed their financial
								lives with Finova.
							</p>
							<div className="flex flex-col sm:flex-row gap-4 justify-center">
								<Button variant="hero" size="lg" asChild>
									<Link to="/signup">Get started free</Link>
								</Button>
								<Button variant="hero-outline" size="lg" asChild>
									<Link to="/contact">Contact sales</Link>
								</Button>
							</div>
						</motion.div>
					</div>
				</section>
			</main>
		</LandingLayout>
	);
}
