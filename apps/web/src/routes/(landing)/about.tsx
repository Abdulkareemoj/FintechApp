import { createFileRoute } from "@tanstack/react-router";
import { Heart, Target, Users, Zap } from "lucide-react";
import { motion } from "motion/react";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/about")({
	component: AboutPage,
});

function AboutPage() {
	const values = [
		{
			icon: Target,
			title: "Mission-Driven",
			description:
				"We're on a mission to democratize financial wellness for everyone, everywhere.",
		},
		{
			icon: Users,
			title: "User-First",
			description:
				"Every decision we make starts with our users. Their success is our success.",
		},
		{
			icon: Heart,
			title: "Transparency",
			description:
				"No hidden fees, no surprises. We believe in honest, clear communication.",
		},
		{
			icon: Zap,
			title: "Innovation",
			description:
				"We constantly push boundaries to bring you the smartest financial tools.",
		},
	];

	const team = [
		{
			name: "Sarah Chen",
			role: "CEO & Co-Founder",
			bio: "Former Goldman Sachs, Stanford MBA",
		},
		{
			name: "Marcus Johnson",
			role: "CTO & Co-Founder",
			bio: "Ex-Stripe engineer, MIT CS",
		},
		{
			name: "Elena Rodriguez",
			role: "Head of Product",
			bio: "Former Revolut, 10+ years fintech",
		},
		{
			name: "David Kim",
			role: "Head of Design",
			bio: "Ex-Apple, award-winning designer",
		},
	];
	return (
		<LandingLayout>
			<main className="pt-24">
				{/* Hero */}
				<section className="py-20 lg:py-28 bg-gradient-hero">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							className="text-center max-w-3xl mx-auto"
						>
							<h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
								About <span className="italic-accent">Finova</span>
							</h1>
							<p className="text-lg text-muted-foreground leading-relaxed">
								We're building the future of personal finance. Founded in 2023,
								Finova combines cutting-edge technology with human-centered
								design to help millions take control of their financial future.
							</p>
						</motion.div>
					</div>
				</section>

				{/* Story */}
				<section className="py-20 bg-background">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="grid lg:grid-cols-2 gap-12 items-center">
							<motion.div
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
							>
								<span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
									Our Story
								</span>
								<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-6">
									Born from a <span className="italic-accent">simple</span>{" "}
									frustration
								</h2>
								<div className="space-y-4 text-muted-foreground leading-relaxed">
									<p>
										It started when our founders, both finance professionals,
										realized that the tools they used daily at work were
										completely inaccessible to regular people.
									</p>
									<p>
										Why should understanding your money require a finance
										degree? Why should budgeting feel like a chore? Why should
										investing be intimidating?
									</p>
									<p>
										We set out to build something different—a platform that
										makes financial management as intuitive as scrolling through
										your favorite app.
									</p>
								</div>
							</motion.div>
							<motion.div
								initial={{ opacity: 0, x: 20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								className="bg-secondary/30 rounded-3xl p-8 lg:p-12"
							>
								<div className="grid grid-cols-2 gap-6">
									{[
										{ number: "500K+", label: "Active Users" },
										{ number: "$2B+", label: "Assets Tracked" },
										{ number: "98%", label: "User Satisfaction" },
										{ number: "50+", label: "Countries" },
									].map((stat) => (
										<div key={stat.label} className="text-center">
											<div className="text-3xl lg:text-4xl font-bold text-primary mb-2">
												{stat.number}
											</div>
											<div className="text-sm text-muted-foreground">
												{stat.label}
											</div>
										</div>
									))}
								</div>
							</motion.div>
						</div>
					</div>
				</section>

				{/* Values */}
				<section className="py-20 bg-secondary/30">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-center max-w-2xl mx-auto mb-16"
						>
							<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
								Our <span className="italic-accent">values</span>
							</h2>
							<p className="text-muted-foreground">
								The principles that guide every decision we make.
							</p>
						</motion.div>
						<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
							{values.map((value, index) => (
								<motion.div
									key={value.title}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
									className="bg-card rounded-2xl p-6 shadow-card text-center"
								>
									<div className="w-14 h-14 rounded-xl bg-blue-100 flex items-center justify-center mx-auto mb-4">
										<value.icon className="w-7 h-7 text-primary" />
									</div>
									<h3 className="text-lg font-semibold text-foreground mb-2">
										{value.title}
									</h3>
									<p className="text-sm text-muted-foreground">
										{value.description}
									</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>

				{/* Team */}
				<section className="py-20 bg-background">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							className="text-center max-w-2xl mx-auto mb-16"
						>
							<h2 className="text-3xl sm:text-4xl font-bold text-foreground mb-4">
								Meet the <span className="italic-accent">team</span>
							</h2>
							<p className="text-muted-foreground">
								World-class talent united by a shared mission.
							</p>
						</motion.div>
						<div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
							{team.map((member, index) => (
								<motion.div
									key={member.name}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.1 }}
									className="text-center"
								>
									<div className="w-32 h-32 rounded-full bg-secondary mx-auto mb-4" />
									<h3 className="font-semibold text-foreground mb-1">
										{member.name}
									</h3>
									<p className="text-sm text-primary mb-2">{member.role}</p>
									<p className="text-xs text-muted-foreground">{member.bio}</p>
								</motion.div>
							))}
						</div>
					</div>
				</section>
			</main>
		</LandingLayout>
	);
}
