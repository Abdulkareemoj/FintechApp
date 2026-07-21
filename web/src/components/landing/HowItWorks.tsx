import { BarChart3, Target, UserPlus } from "lucide-react";
import { motion } from "motion/react";
import creditCard from "/credit-card.png";

const HowItWorks = () => {
	const steps = [
		{
			number: "01",
			icon: UserPlus,
			title: "Sign up",
			description: "Create your free account in minutes—no payment, no hassle.",
		},
		{
			number: "02",
			icon: Target,
			title: "Set your goals",
			description:
				"Tell us what you're working toward, and we'll help build personalized plans.",
		},
		{
			number: "03",
			icon: BarChart3,
			title: "Track your progress",
			description:
				"Get real-time updates, hit your milestones, and stay motivated with smart insights.",
		},
	];

	return (
		<section className="py-20 lg:py-28 bg-secondary/30">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center max-w-2xl mx-auto mb-16"
				>
					<span className="text-sm font-medium text-primary uppercase tracking-wider mb-4 block">
						How it works
					</span>
					<h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
						How it works in
						<br />
						three <span className="italic-accent">simple</span> steps
					</h2>
					<p className="text-muted-foreground text-lg">
						From setting goals to tracking your progress—here's how we help you
						take control of your money.
					</p>
				</motion.div>

				<div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
					{/* Steps */}
					<motion.div
						initial={{ opacity: 0, x: -30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="space-y-8"
					>
						{steps.map((step, index) => (
							<motion.div
								key={step.title}
								initial={{ opacity: 0, x: -20 }}
								whileInView={{ opacity: 1, x: 0 }}
								viewport={{ once: true }}
								transition={{ delay: index * 0.15 }}
								className="flex gap-5"
							>
								<div className="flex-shrink-0">
									<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center">
										<step.icon className="w-5 h-5 text-primary-foreground" />
									</div>
								</div>
								<div>
									<h3 className="text-lg font-semibold text-foreground mb-2">
										{step.title}
									</h3>
									<p className="text-muted-foreground leading-relaxed">
										{step.description}
									</p>
								</div>
							</motion.div>
						))}
					</motion.div>

					{/* Image */}
					<motion.div
						initial={{ opacity: 0, x: 30 }}
						whileInView={{ opacity: 1, x: 0 }}
						viewport={{ once: true }}
						className="relative flex justify-center"
					>
						<motion.img
							src={creditCard}
							alt="Finova card"
							className="w-full max-w-md rounded-2xl shadow-xl"
							animate={{ rotate: [-2, 2, -2] }}
							transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
						/>
						<div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] rounded-full bg-teal-100/50 blur-3xl" />
					</motion.div>
				</div>
			</div>
		</section>
	);
};

export default HowItWorks;
