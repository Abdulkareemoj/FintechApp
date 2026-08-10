import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
	type ReactNode,
	useCallback,
	useEffect,
	useRef,
	useState,
} from "react";
import { Reveal } from "@/components/landing/Reveal";
import { Button } from "@/components/ui/button";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/")({ component: LandingPage });

function LandingPage() {
	return (
		<LandingLayout>
			<HeroCarousel />
			<CategorySection />
			<FeaturesSection />
			<StatsSection />
			<TestimonialSection />
			<CTASection />
		</LandingLayout>
	);
}

// ─── Staggered text block (replays via .is-shown toggle) ─────────────────────
function StaggerText({ lines }: { lines: { key: string; node: ReactNode }[] }) {
	const ref = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const block = ref.current;
		if (!block) return;
		block.classList.remove("is-shown");
		void block.offsetHeight;
		block.classList.add("is-shown");
	}, []);

	return (
		<div ref={ref} className="t-stagger">
			{lines.map(({ key, node }, i) => (
				<div
					key={key}
					className={`t-stagger-line ${i > 0 ? `t-stagger-line--${i + 1}` : ""}`}
				>
					{node}
				</div>
			))}
		</div>
	);
}

// ─── Full-viewport hero carousel ──────────────────────────────────────────────
const slides = [
	{
		name: "Finova Card",
		promo: "0% APR Available",
		subtitle: "Earn 3% cash back on everything. No annual fee.",
		image:
			"radial-gradient(120% 90% at 50% 0%, #1f2530 0%, #171a20 55%, #0f1116 100%)",
	},
	{
		name: "Finova Invest",
		promo: "Begin investing today",
		subtitle: "Fractional shares, automated portfolios, zero commission.",
		image:
			"radial-gradient(120% 90% at 50% 100%, #222a3a 0%, #171a20 55%, #0e1117 100%)",
	},
	{
		name: "Finova Business",
		promo: "Banking built for builders",
		subtitle: "Open an account in minutes. Scale without the paperwork.",
		image:
			"radial-gradient(120% 90% at 80% 20%, #1c2430 0%, #171a20 50%, #0d1016 100%)",
	},
];

function HeroCarousel() {
	const [index, setIndex] = useState(0);

	const next = useCallback(() => setIndex((i) => (i + 1) % slides.length), []);
	const prev = useCallback(
		() => setIndex((i) => (i - 1 + slides.length) % slides.length),
		[],
	);

	useEffect(() => {
		const t = setInterval(next, 6000);
		return () => clearInterval(t);
	}, [next]);

	return (
		<section className="relative overflow-hidden" style={{ height: "100vh" }}>
			{slides.map((slide, i) => (
				<div
					key={slide.name}
					className="absolute inset-0 transition-opacity duration-700"
					style={{
						opacity: i === index ? 1 : 0,
						background: slide.image,
					}}
				>
					{/* cinematic haze */}
					<div
						className="absolute inset-0"
						style={{
							background:
								"radial-gradient(60% 50% at 50% 68%, rgba(62,106,225,0.18) 0%, transparent 70%)",
						}}
					/>
					<div className="relative flex h-full flex-col items-center justify-center px-4 text-center">
						<StaggerText
							key={index}
							lines={[
								{
									key: `promo-${slide.name}`,
									node: (
										<p
											className="mb-3 text-[22px] font-normal text-primary"
											style={{ lineHeight: 1 }}
										>
											{slide.promo}
										</p>
									),
								},
								{
									key: `title-${slide.name}`,
									node: (
										<h1 className="text-[40px] font-medium text-white">
											{slide.name}
										</h1>
									),
								},
								{
									key: `subtitle-${slide.name}`,
									node: (
										<p className="mt-4 max-w-md text-sm font-normal text-white/70">
											{slide.subtitle}
										</p>
									),
								},
								{
									key: `cta-${slide.name}`,
									node: (
										<div className="mt-10 flex flex-col gap-4 sm:flex-row">
											<Button
												className="h-10 w-60 rounded bg-primary text-sm font-medium text-white transition-colors duration-300 hover:bg-primary/90"
												asChild
											>
												<Link to="/signup">Get Started</Link>
											</Button>
											<Button
												className="h-10 w-60 rounded border-2 border-white/30 bg-white text-sm font-medium text-[#171a20] transition-colors duration-300 hover:bg-white/90"
												asChild
											>
												<Link to="/features">Learn More</Link>
											</Button>
										</div>
									),
								},
							]}
						/>
					</div>
				</div>
			))}

			{/* edge arrows */}
			<button
				type="button"
				aria-label="Previous"
				onClick={prev}
				className="absolute top-1/2 left-4 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white transition-colors duration-300 hover:bg-white/50 sm:flex"
			>
				<ChevronLeft className="size-5" />
			</button>
			<button
				type="button"
				aria-label="Next"
				onClick={next}
				className="absolute top-1/2 right-4 z-10 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/30 text-white transition-colors duration-300 hover:bg-white/50 sm:flex"
			>
				<ChevronRight className="size-5" />
			</button>

			{/* dot indicators */}
			<div className="absolute bottom-10 left-1/2 z-10 flex -translate-x-1/2 gap-2">
				{slides.map((slide, i) => (
					<button
						key={slide.name}
						type="button"
						aria-label={`Go to ${slide.name}`}
						onClick={() => setIndex(i)}
						className="h-2 w-2 rounded-full transition-colors duration-300"
						style={{
							backgroundColor:
								i === index ? "#FFFFFF" : "rgba(255,255,255,0.4)",
						}}
					/>
				))}
			</div>
		</section>
	);
}

// ─── Category cards ───────────────────────────────────────────────────────────
const categories = [
	{
		label: "Personal Banking",
		image: "linear-gradient(rgba(23,26,32,0.35), rgba(23,26,32,0.55)), url('')",
		background:
			"radial-gradient(100% 100% at 0% 0%, #2a3550 0%, #171a20 60%, #0d1016 100%)",
	},
	{
		label: "Investing",
		image: "",
		background:
			"radial-gradient(100% 100% at 100% 0%, #23304a 0%, #171a20 60%, #0e1117 100%)",
	},
	{
		label: "Business",
		image: "",
		background:
			"radial-gradient(100% 100% at 50% 100%, #1f2a3f 0%, #171a20 60%, #0d1016 100%)",
	},
];

function CategorySection() {
	return (
		<section className="bg-background py-24">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<Reveal>
					<h2 className="t-stagger-line t-stagger-line--2 mb-10 text-center text-[40px] font-medium text-foreground">
						Explore Finova
					</h2>
				</Reveal>
				<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{categories.map((cat, i) => (
						<Reveal
							key={cat.label}
							stagger={false}
							className={i === 0 ? "sm:col-span-2 lg:col-span-1" : ""}
						>
							<Link
								to="/features"
								className="group relative block h-full overflow-hidden rounded-xl transition-opacity duration-300 hover:opacity-95"
								style={{ aspectRatio: "16 / 10" }}
							>
								<div
									className="absolute inset-0"
									style={{ background: cat.background }}
								/>
								<span className="absolute top-4 left-5 text-lg font-medium text-white">
									{cat.label}
								</span>
							</Link>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}

// ─── Features ─────────────────────────────────────────────────────────────────
const features = [
	{
		title: "Instant Transfers",
		description:
			"Send and receive money in seconds, globally, with zero hidden fees.",
	},
	{
		title: "Bank-Grade Security",
		description:
			"Your funds are protected with the latest encryption and fraud detection technology.",
	},
	{
		title: "Smart Analytics",
		description:
			"AI-powered insights help you track spending and save more effortlessly.",
	},
];

function FeaturesSection() {
	return (
		<section className="bg-muted py-24">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<Reveal>
					<div className="mb-14 text-center">
						<h2 className="t-stagger-line text-[40px] font-medium text-foreground">
							Built for modern finances
						</h2>
						<p className="t-stagger-line t-stagger-line--2 mx-auto mt-3 max-w-2xl text-sm text-muted-foreground">
							We combine cutting-edge technology with a human-centric approach
							to redefine your financial experience.
						</p>
					</div>
				</Reveal>
				<div className="grid gap-px bg-border md:grid-cols-3">
					{features.map((item) => (
						<Reveal key={item.title} stagger={false}>
							<div className="h-full bg-card p-10">
								<h3 className="text-[17px] font-medium text-foreground">
									{item.title}
								</h3>
								<p className="mt-3 text-sm leading-relaxed text-muted-foreground">
									{item.description}
								</p>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}

// ─── Stats ────────────────────────────────────────────────────────────────────
const stats = [
	{ value: "10M+", label: "Active Users" },
	{ value: "99.9%", label: "Uptime Guarantee" },
	{ value: "$5B+", label: "Processed" },
	{ value: "24/7", label: "Support" },
];

function StatsSection() {
	return (
		<section className="bg-background py-24">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
				<div className="grid grid-cols-2 gap-12 text-center md:grid-cols-4">
					{stats.map((stat, i) => (
						<Reveal key={stat.label}>
							<div
								className={`t-stagger-line ${i > 0 ? `t-stagger-line--${i + 1}` : ""}`}
							>
								<p className="text-[40px] font-medium text-foreground">
									{stat.value}
								</p>
								<p className="mt-2 text-sm font-medium text-muted-foreground">
									{stat.label}
								</p>
							</div>
						</Reveal>
					))}
				</div>
			</div>
		</section>
	);
}

// ─── Testimonial ──────────────────────────────────────────────────────────────
function TestimonialSection() {
	return (
		<section className="bg-muted py-24">
			<div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
				<Reveal>
					<p className="t-stagger-line text-[22px] font-normal leading-relaxed text-foreground">
						"Finova has completely transformed how we handle our finances. The
						platform is intuitive, secure, and the insights are invaluable."
					</p>
					<p className="t-stagger-line t-stagger-line--2 mt-6 text-sm font-medium text-foreground">
						Sarah Mitchell
					</p>
					<p className="t-stagger-line t-stagger-line--3 mt-1 text-sm text-muted-foreground">
						CEO, TechVentures Inc.
					</p>
				</Reveal>
			</div>
		</section>
	);
}

// ─── CTA ──────────────────────────────────────────────────────────────────────
function CTASection() {
	return (
		<section className="bg-background py-24">
			<div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
				<Reveal>
					<h2 className="t-stagger-line text-[40px] font-medium text-foreground">
						Ready to transform your finances?
					</h2>
					<p className="t-stagger-line t-stagger-line--2 mx-auto mt-3 max-w-xl text-sm text-muted-foreground">
						Join thousands of businesses that trust Finova to manage their money
						smarter.
					</p>
					<div className="t-stagger-line t-stagger-line--3 mt-10 flex flex-col justify-center gap-4 sm:flex-row">
						<Button
							className="h-10 w-60 rounded bg-primary text-sm font-medium text-white transition-colors duration-300 hover:bg-primary/90"
							asChild
						>
							<Link to="/signup">
								Open Your Account <ArrowRight className="ml-2 size-4" />
							</Link>
						</Button>
						<Button
							className="h-10 w-60 rounded bg-card text-sm font-medium text-foreground transition-colors duration-300 hover:bg-muted"
							asChild
						>
							<Link to="/features">Learn More</Link>
						</Button>
					</div>
				</Reveal>
			</div>
		</section>
	);
}
