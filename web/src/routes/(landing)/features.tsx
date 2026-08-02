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
			<main>
				{/* Hero */}
				<section
					className="relative flex items-center justify-center overflow-hidden"
					style={{ height: "100vh" }}
				>
					<div
						className="absolute inset-0"
						style={{
							background:
								"radial-gradient(120% 90% at 50% 20%, #212a3a 0%, #171a20 55%, #0d1016 100%)",
						}}
					/>
					<div className="relative z-10 px-4 text-center">
						<h1 className="text-[40px] font-medium text-white">
							Powerful features for your financial success
						</h1>
						<p className="mx-auto mt-4 max-w-xl text-sm text-white/70">
							Everything you need to budget, save, invest, and grow, all in one
							beautifully designed platform.
						</p>
						<div className="mt-10 flex justify-center">
							<Button
								className="h-10 w-60 rounded bg-primary text-sm font-medium text-white transition-colors duration-300 hover:bg-primary/90"
								asChild
							>
								<Link to="/signup">
									Start for free <ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Features Grid */}
				<section className="bg-background py-24">
					<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
						<div className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
							{features.map((feature) => (
								<div key={feature.title} className="bg-card p-8">
									<div className="mb-5 flex h-12 w-12 items-center justify-center rounded bg-muted">
										<feature.icon className="size-6 text-primary" />
									</div>
									<h3 className="text-[17px] font-medium text-foreground">
										{feature.title}
									</h3>
									<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section className="bg-muted py-24">
					<div className="mx-auto max-w-2xl px-4 text-center sm:px-6">
						<h2 className="text-[40px] font-medium text-foreground">
							Ready to take control?
						</h2>
						<p className="mt-3 text-sm text-muted-foreground">
							Join thousands of users who have transformed their financial lives
							with Finova.
						</p>
						<div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
							<Button
								className="h-10 w-60 rounded bg-primary text-sm font-medium text-white transition-colors duration-300 hover:bg-primary/90"
								asChild
							>
								<Link to="/signup">Get started free</Link>
							</Button>
							<Button
								className="h-10 w-60 rounded bg-card text-sm font-medium text-foreground transition-colors duration-300 hover:bg-muted"
								asChild
							>
								<Link to="/contact">Contact sales</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>
		</LandingLayout>
	);
}
