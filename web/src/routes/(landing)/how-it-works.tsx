import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/how-it-works")({
	component: HowItWorksPage,
});

function HowItWorksPage() {
	const steps = [
		{
			number: "01",
			title: "Create your account",
			description:
				"Sign up in seconds with just your email. No credit card required, no hidden fees.",
		},
		{
			number: "02",
			title: "Connect your accounts",
			description:
				"Securely link your bank accounts, credit cards, and investments. We support over 10,000 institutions.",
		},
		{
			number: "03",
			title: "Set your goals",
			description:
				"Whether it's saving for a vacation, paying off debt, or building an emergency fund, we'll help you get there.",
		},
		{
			number: "04",
			title: "Watch your progress",
			description:
				"Get personalized insights, smart alerts, and beautiful visualizations of your financial journey.",
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
								"radial-gradient(120% 90% at 50% 30%, #22304a 0%, #171a20 55%, #0d1016 100%)",
						}}
					/>
					<div className="relative z-10 px-4 text-center">
						<h1 className="text-[40px] font-medium text-white">
							How Finova works
						</h1>
						<p className="mx-auto mt-4 max-w-xl text-sm text-white/70">
							From signup to financial freedom in four simple steps. No
							complexity, no confusion.
						</p>
					</div>
				</section>

				{/* Steps */}
				<section className="bg-background py-24">
					<div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
						<div className="divide-y divide-border">
							{steps.map((step) => (
								<div
									key={step.number}
									className="grid gap-6 py-12 md:grid-cols-[120px_1fr]"
								>
									<span className="text-[40px] font-medium text-border">
										{step.number}
									</span>
									<div>
										<h3 className="text-[22px] font-medium text-foreground">
											{step.title}
										</h3>
										<p className="mt-3 max-w-lg text-sm leading-relaxed text-muted-foreground">
											{step.description}
										</p>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* CTA */}
				<section
					className="relative flex items-center justify-center overflow-hidden py-24"
					style={{ minHeight: "60vh" }}
				>
					<div
						className="absolute inset-0"
						style={{
							background:
								"radial-gradient(100% 100% at 50% 100%, #243147 0%, #171a20 60%, #0d1016 100%)",
						}}
					/>
					<div className="relative z-10 px-4 text-center">
						<h2 className="text-[40px] font-medium text-white">
							Ready to get started?
						</h2>
						<p className="mx-auto mt-3 max-w-md text-sm text-white/70">
							Join over 500,000 users who trust Finova with their finances.
						</p>
						<div className="mt-10 flex justify-center">
							<Button
								className="h-10 w-60 rounded bg-primary text-sm font-medium text-white transition-colors duration-300 hover:bg-primary/90"
								asChild
							>
								<Link to="/signup">
									Create free account <ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>
		</LandingLayout>
	);
}
