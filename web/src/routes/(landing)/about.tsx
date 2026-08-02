import { createFileRoute } from "@tanstack/react-router";
import { Heart, Target, Users, Zap } from "lucide-react";
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

	const stats = [
		{ number: "500K+", label: "Active Users" },
		{ number: "$2B+", label: "Assets Tracked" },
		{ number: "98%", label: "User Satisfaction" },
		{ number: "50+", label: "Countries" },
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
								"radial-gradient(120% 90% at 50% 25%, #253048 0%, #171a20 55%, #0d1016 100%)",
						}}
					/>
					<div className="relative z-10 px-4 text-center">
						<h1 className="text-[40px] font-medium text-white">About Finova</h1>
						<p className="mx-auto mt-4 max-w-xl text-sm text-white/70">
							We're building the future of personal finance. Founded in 2023,
							Finova combines cutting-edge technology with human-centered design
							to help millions take control of their financial future.
						</p>
					</div>
				</section>

				{/* Story + Stats */}
				<section className="bg-background py-24">
					<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
						<div className="grid gap-16 lg:grid-cols-2">
							<div>
								<p className="text-sm font-medium text-primary">Our Story</p>
								<h2 className="mt-3 text-[40px] font-medium text-foreground">
									Born from a simple frustration
								</h2>
								<div className="mt-6 space-y-4 text-sm leading-relaxed text-muted-foreground">
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
										We set out to build something different, a platform that
										makes financial management as intuitive as scrolling through
										your favorite app.
									</p>
								</div>
							</div>
							<div className="grid grid-cols-2 gap-px self-center bg-border">
								{stats.map((stat) => (
									<div key={stat.label} className="bg-card p-8 text-center">
										<div className="text-[40px] font-medium text-foreground">
											{stat.number}
										</div>
										<div className="mt-2 text-sm text-muted-foreground">
											{stat.label}
										</div>
									</div>
								))}
							</div>
						</div>
					</div>
				</section>

				{/* Values */}
				<section className="bg-muted py-24">
					<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
						<h2 className="text-center text-[40px] font-medium text-foreground">
							Our values
						</h2>
						<p className="mx-auto mt-3 max-w-md text-center text-sm text-muted-foreground">
							The principles that guide every decision we make.
						</p>
						<div className="mt-14 grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-4">
							{values.map((value) => (
								<div key={value.title} className="bg-card p-8 text-center">
									<div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded bg-muted">
										<value.icon className="size-7 text-primary" />
									</div>
									<h3 className="text-[17px] font-medium text-foreground">
										{value.title}
									</h3>
									<p className="mt-3 text-sm text-muted-foreground">
										{value.description}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>

				{/* Team */}
				<section className="bg-background py-24">
					<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
						<h2 className="text-center text-[40px] font-medium text-foreground">
							Meet the team
						</h2>
						<p className="mx-auto mt-3 max-w-md text-center text-sm text-muted-foreground">
							World-class talent united by a shared mission.
						</p>
						<div className="mt-14 grid gap-12 sm:grid-cols-2 lg:grid-cols-4">
							{team.map((member) => (
								<div key={member.name} className="text-center">
									<div className="mx-auto mb-4 h-24 w-24 rounded-full bg-muted" />
									<h3 className="text-[17px] font-medium text-foreground">
										{member.name}
									</h3>
									<p className="mt-1 text-sm text-primary">{member.role}</p>
									<p className="mt-1 text-xs text-muted-foreground">
										{member.bio}
									</p>
								</div>
							))}
						</div>
					</div>
				</section>
			</main>
		</LandingLayout>
	);
}
