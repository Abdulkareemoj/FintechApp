import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Eye, Lock, Server, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/security")({
	component: SecurityPage,
});

function SecurityPage() {
	const features = [
		{
			icon: Lock,
			title: "256-bit Encryption",
			description:
				"All data is encrypted in transit and at rest using bank-level encryption standards.",
		},
		{
			icon: Eye,
			title: "Biometric Authentication",
			description:
				"Secure your account with Face ID, Touch ID, or fingerprint authentication.",
		},
		{
			icon: Server,
			title: "SOC 2 Type II Certified",
			description:
				"Our security practices are regularly audited by independent third parties.",
		},
		{
			icon: Shield,
			title: "Fraud Protection",
			description:
				"Advanced AI-powered fraud detection monitors for suspicious activity 24/7.",
		},
	];

	const certifications = [
		"SOC 2 Type II",
		"GDPR Compliant",
		"CCPA Compliant",
		"PCI DSS Level 1",
		"ISO 27001",
	];

	return (
		<LandingLayout>
			<main>
				{/* Hero */}
				<section
					className="relative flex items-center overflow-hidden"
					style={{ height: "100vh" }}
				>
					<div
						className="absolute inset-0"
						style={{
							background:
								"radial-gradient(120% 90% at 50% 25%, #20283a 0%, #171a20 55%, #0d1016 100%)",
						}}
					/>
					<div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
						<h1 className="max-w-2xl text-[40px] font-medium text-white">
							Your security is our priority
						</h1>
						<p className="mt-4 max-w-lg text-sm text-white/70">
							We protect your financial data with the same level of security
							used by major banks and financial institutions worldwide.
						</p>
						<div className="mt-10 flex">
							<Button
								className="h-10 w-60 rounded bg-primary text-sm font-medium text-white transition-colors duration-300 hover:bg-primary/90"
								asChild
							>
								<Link to="/signup">
									Start secure banking <ArrowRight className="ml-2 size-4" />
								</Link>
							</Button>
						</div>
					</div>
				</section>

				{/* Security Features */}
				<section className="bg-background py-24">
					<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
						<h2 className="text-center text-[40px] font-medium text-foreground">
							Enterprise-grade protection
						</h2>
						<p className="mx-auto mt-3 max-w-md text-center text-sm text-muted-foreground">
							Multiple layers of security to keep your money and data safe.
						</p>
						<div className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
							{features.map((feature) => (
								<div key={feature.title} className="bg-card p-8 text-center">
									<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded bg-muted">
										<feature.icon className="size-7 text-primary" />
									</div>
									<h3 className="text-[17px] font-medium text-foreground">
										{feature.title}
									</h3>
									<p className="mt-3 text-sm text-muted-foreground">
										{feature.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Certifications */}
				<section className="bg-muted py-24">
					<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
						<h2 className="text-center text-[40px] font-medium text-foreground">
							Trusted & certified
						</h2>
						<div className="mt-12 flex flex-wrap justify-center gap-4">
							{certifications.map((cert) => (
								<span
									key={cert}
									className="rounded bg-card px-6 py-3 text-sm font-medium text-foreground"
								>
									{cert}
								</span>
							))}
						</div>
					</div>
				</section>

				{/* Security Promise */}
				<section
					className="relative flex items-center justify-center overflow-hidden py-24"
					style={{ minHeight: "60vh" }}
				>
					<div
						className="absolute inset-0"
						style={{
							background:
								"radial-gradient(100% 100% at 50% 100%, #22304a 0%, #171a20 60%, #0d1016 100%)",
						}}
					/>
					<div className="relative z-10 px-4 text-center">
						<h2 className="text-[40px] font-medium text-white">
							Our Security Promise
						</h2>
						<p className="mx-auto mt-3 max-w-xl text-sm text-white/70">
							If unauthorized transactions occur due to a security breach on our
							end, we guarantee 100% reimbursement. Your trust is our most
							valuable asset.
						</p>
						<div className="mt-10 flex justify-center">
							<Button
								className="h-10 w-60 rounded bg-primary text-sm font-medium text-white transition-colors duration-300 hover:bg-primary/90"
								asChild
							>
								<Link to="/contact">Learn more</Link>
							</Button>
						</div>
					</div>
				</section>
			</main>
		</LandingLayout>
	);
}
