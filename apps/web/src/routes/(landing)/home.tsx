import { createFileRoute, Link } from "@tanstack/react-router";
import {
	ArrowRightIcon,
	ShieldIcon,
	TrendingUpIcon,
	ZapIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { LandingLayout } from "@/layout/LandingLayout";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(landing)/home")({
	component: LandingPage,
});

function LandingPage() {
	return (
		<LandingLayout>
			<div className="space-y-24">
				<HeroSection />
				<FeaturesSection />
				<StatsSection />
				<CallToActionSection />
			</div>
		</LandingLayout>
	);
}

function HeroSection() {
	return (
		<section className="container py-20 md:py-32">
			<div className="grid items-center gap-12 lg:grid-cols-2">
				<div className="space-y-6">
					<h1 className="font-extrabold text-5xl tracking-tight sm:text-6xl lg:text-7xl">
						The Future of Digital Banking is Here.
					</h1>
					<p className="text-muted-foreground text-xl">
						Finpay is the modern, secure, and intelligent way to manage your
						money. Experience seamless transactions, smart budgeting, and 24/7
						support.
					</p>
					<div className="flex space-x-4 pt-4">
						<Button asChild size="lg">
							<Link to="/signup">
								Get Started <ArrowRightIcon className="ml-2 h-4 w-4" />
							</Link>
						</Button>
						<Button asChild size="lg" variant="outline">
							<Link to="/features">View Demo</Link>
						</Button>
					</div>
				</div>
				<div className="relative hidden lg:block">
					{/* Placeholder for the large illustration/image from the attachment */}
					<div className="aspect-video w-full rounded-xl bg-muted/50 shadow-2xl dark:bg-muted/20">
						<div className="flex h-full items-center justify-center text-muted-foreground">
							<p>Fintech Illustration Placeholder</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

const featureItems = [
	{
		icon: ZapIcon,
		title: "Instant Transfers",
		description:
			"Send and receive money in seconds, globally, with zero hidden fees.",
	},
	{
		icon: ShieldIcon,
		title: "Bank-Grade Security",
		description:
			"Your funds are protected with the latest encryption and fraud detection technology.",
	},
	{
		icon: TrendingUpIcon,
		title: "Smart Budgeting",
		description:
			"AI-powered insights help you track spending and save more effortlessly.",
	},
];

function FeaturesSection() {
	return (
		<section className="container py-12">
			<div className="mb-12 space-y-4 text-center">
				<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
					Why Choose Finpay?
				</h2>
				<p className="mx-auto max-w-2xl text-muted-foreground">
					We combine cutting-edge technology with a human-centric approach to
					redefine your financial experience.
				</p>
			</div>
			<div className="grid gap-8 md:grid-cols-3">
				{featureItems.map((item, index) => (
					<Card
						className="space-y-4 p-6 transition-all hover:shadow-lg"
						key={index}
					>
						<item.icon className="h-8 w-8 text-primary" />
						<h3 className="font-semibold text-xl">{item.title}</h3>
						<p className="text-muted-foreground">{item.description}</p>
					</Card>
				))}
			</div>
		</section>
	);
}

const stats = [
	{ value: "10M+", label: "Active Users" },
	{ value: "99.9%", label: "Uptime Guarantee" },
	{ value: "$5B+", label: "Processed Transactions" },
	{ value: "24/7", label: "Customer Support" },
];

function StatsSection() {
	return (
		<section className="bg-muted/50 py-16">
			<div className="container">
				<div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
					{stats.map((stat, index) => (
						<div className="space-y-2" key={index}>
							<p className="font-bold text-4xl text-primary">{stat.value}</p>
							<p className="font-medium text-muted-foreground text-sm">
								{stat.label}
							</p>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}

function CallToActionSection() {
	return (
		<section className="container py-16">
			<Card
				className={cn(
					"bg-primary p-10 text-center text-primary-foreground shadow-xl",
				)}
			>
				<h2 className="font-bold text-3xl tracking-tight sm:text-4xl">
					Ready to take control of your finances?
				</h2>
				<p className="mt-4 text-lg opacity-90">
					Join Finpay today and start banking smarter, not harder.
				</p>
				<Button asChild className="mt-8" size="lg" variant="secondary">
					<Link to="/signup">
						Open Your Account Now <ArrowRightIcon className="ml-2 h-4 w-4" />
					</Link>
				</Button>
			</Card>
		</section>
	);
}
