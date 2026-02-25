import { createFileRoute } from "@tanstack/react-router";
import CTA from "@/components/landing/CTA";
import Features from "@/components/landing/Features";
import Hero from "@/components/landing/Hero";
import HowItWorks from "@/components/landing/HowItWorks";
import Security from "@/components/landing/Security";
import Testimonials from "@/components/landing/Testimonials";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/")({ component: App });

function App() {
	return (
		<LandingLayout>
			<main>
				<Hero />
				<Features />
				<HowItWorks />
				<Security />
				<Testimonials />
				<CTA />
			</main>
		</LandingLayout>
	);
}
