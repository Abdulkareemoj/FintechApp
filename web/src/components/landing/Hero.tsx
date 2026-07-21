import { Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import heroPhone from "/hero-phone.png";

const Hero = () => {
	const logos = ["Kinetic", "Grasshopper", "EatUp Eats", "Fusion & Co"];

	return (
		<section className="relative overflow-hidden bg-soft-teal pt-24 pb-16 lg:pt-32 lg:pb-24">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				<div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
					{/* Left Content */}
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="text-center lg:text-left"
						initial={{ opacity: 0, y: 20 }}
						transition={{ duration: 0.6 }}
					>
						{/* Badge */}
						<motion.div
							animate={{ opacity: 1, scale: 1 }}
							className="mb-6 inline-flex items-center gap-2 rounded-full bg-teal-50 px-4 py-2 font-medium text-primary text-sm"
							initial={{ opacity: 0, scale: 0.9 }}
							transition={{ delay: 0.2 }}
						>
							<Sparkles className="h-4 w-4" />
							Smarter finance for changemakers
						</motion.div>

						{/* Headline */}
						<h1 className="mb-6 font-bold text-4xl text-foreground leading-tight sm:text-5xl lg:text-6xl">
							Finance that <span className="italic-accent">works</span>
							<br />
							as hard as you do
						</h1>

						{/* Subheadline */}
						<p className="mx-auto mb-8 max-w-lg text-lg text-muted-foreground lg:mx-0">
							A seamless platform to track spending, set savings goals, and
							begin investing—all in one place. Take control today.
						</p>

						{/* CTAs */}
						<div className="mb-12 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
							<Button asChild size="lg" variant="hero">
								<Link to="/signup">
									Get started
									<ArrowRight className="h-4 w-4" />
								</Link>
							</Button>
							<Button asChild size="lg" variant="hero-outline">
								<Link to="/features">Explore features</Link>
							</Button>
						</div>

						{/* Trust Logos */}
						<div className="space-y-3">
							<p className="text-muted-foreground text-xs uppercase tracking-wider">
								Built for real life, powered by smart finance
							</p>
							<div className="flex flex-wrap items-center justify-center gap-6 lg:justify-start">
								{logos.map((logo) => (
									<span
										className="font-medium text-muted-foreground/70 text-sm"
										key={logo}
									>
										{logo}
									</span>
								))}
							</div>
						</div>
					</motion.div>

					{/* Right Content - Phone Mockup */}
					<motion.div
						animate={{ opacity: 1, x: 0 }}
						className="relative flex justify-center lg:justify-end"
						initial={{ opacity: 0, x: 40 }}
						transition={{ duration: 0.8, delay: 0.3 }}
					>
						<div className="relative">
							<motion.img
								alt="Finova app dashboard"
								animate={{ y: [0, -10, 0] }}
								className="w-72 drop-shadow-2xl sm:w-80 lg:w-96"
								src={heroPhone}
								transition={{
									duration: 4,
									repeat: Number.POSITIVE_INFINITY,
									ease: "easeInOut",
								}}
							/>
							{/* Decorative elements */}
							<div className="-z-10 -translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-[120%] w-[120%] rounded-full bg-teal-100/50 blur-3xl" />
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default Hero;
