import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LandingLayout } from "@/layout/LandingLayout";
export const Route = createFileRoute("/(landing)/terms-of-service")({
	component: TermsOfServicePage,
});

function TermsOfServicePage() {
	const sections = [
		{
			title: "1. Acceptance of Terms",
			content: `By accessing or using Finova's services, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing our services.`,
		},
		{
			title: "2. Use License",
			content: `Permission is granted to temporarily use Finova's services for personal, non-commercial use. This license does not include:

• Modifying or copying our materials
• Using materials for commercial purposes
• Attempting to decompile or reverse engineer any software
• Removing any copyright or proprietary notations
• Transferring the materials to another person`,
		},
		{
			title: "3. Account Responsibilities",
			content: `When you create an account with us, you must provide accurate and complete information. You are responsible for:

• Maintaining the confidentiality of your account credentials
• All activities that occur under your account
• Notifying us immediately of any unauthorized use
• Ensuring your contact information is up to date`,
		},
		{
			title: "4. Service Modifications",
			content: `Finova reserves the right to modify, suspend, or discontinue any part of our services at any time without prior notice. We shall not be liable to you or any third party for any modification, suspension, or discontinuance of the service.`,
		},
		{
			title: "5. Limitation of Liability",
			content: `In no event shall Finova or its suppliers be liable for any damages arising out of the use or inability to use our services. This includes but is not limited to:

• Direct, indirect, incidental, or consequential damages
• Loss of data or profits
• Business interruption
• Any damages whatsoever arising from these terms`,
		},
		{
			title: "6. Financial Information Disclaimer",
			content: `Finova provides tools for financial tracking and management. However:

• We do not provide financial, investment, or legal advice
• Information provided is for informational purposes only
• You should consult qualified professionals for financial decisions
• Past performance is not indicative of future results`,
		},
		{
			title: "7. Governing Law",
			content: `These terms shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes shall be resolved in the courts of San Francisco County.`,
		},
		{
			title: "8. Contact Information",
			content: `If you have any questions about these Terms of Service, please contact us at:

Email: legal@finova.com
Address: 123 Finance Street, Suite 400, San Francisco, CA 94102`,
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
								Terms of <span className="italic-accent">Service</span>
							</h1>
							<p className="text-lg text-muted-foreground">
								Last updated: January 13, 2026
							</p>
						</motion.div>
					</div>
				</section>

				{/* Content */}
				<section className="py-20 bg-background">
					<div className="container mx-auto px-4 sm:px-6 lg:px-8">
						<div className="max-w-3xl mx-auto">
							<motion.p
								initial={{ opacity: 0, y: 20 }}
								whileInView={{ opacity: 1, y: 0 }}
								viewport={{ once: true }}
								className="text-muted-foreground mb-12 leading-relaxed"
							>
								Please read these Terms of Service carefully before using
								Finova. These terms govern your use of our website, mobile
								applications, and all related services.
							</motion.p>

							{sections.map((section, index) => (
								<motion.div
									key={section.title}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{ delay: index * 0.05 }}
									className="mb-10"
								>
									<h2 className="text-xl font-semibold text-foreground mb-4">
										{section.title}
									</h2>
									<div className="text-muted-foreground leading-relaxed whitespace-pre-line">
										{section.content}
									</div>
								</motion.div>
							))}
						</div>
					</div>
				</section>
			</main>
		</LandingLayout>
	);
}
