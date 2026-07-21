import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { LandingLayout } from "@/layout/LandingLayout";
export const Route = createFileRoute("/(landing)/privacy-policy")({
	component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
	const sections = [
		{
			title: "Information We Collect",
			content: `We collect information you provide directly to us, such as when you create an account, make a transaction, or contact us for support. This includes:
      
• Personal identification information (name, email address, phone number)
• Financial information (bank account details, transaction history)
• Usage data (how you interact with our services)
• Device information (IP address, browser type, operating system)`,
		},
		{
			title: "How We Use Your Information",
			content: `We use the information we collect to:

• Provide, maintain, and improve our services
• Process transactions and send related information
• Send you technical notices, updates, and support messages
• Respond to your comments, questions, and requests
• Monitor and analyze trends, usage, and activities
• Detect, investigate, and prevent fraudulent transactions`,
		},
		{
			title: "Information Sharing",
			content: `We do not sell, trade, or rent your personal information to third parties. We may share your information only in the following circumstances:

• With your consent or at your direction
• With service providers who work on our behalf
• To comply with legal obligations
• To protect our rights, privacy, safety, or property`,
		},
		{
			title: "Data Security",
			content: `We take the security of your data seriously and implement industry-standard measures to protect it:

• 256-bit SSL encryption for all data transmission
• SOC 2 Type II compliance
• Regular security audits and penetration testing
• Multi-factor authentication options
• Encrypted data storage`,
		},
		{
			title: "Your Rights",
			content: `You have the right to:

• Access your personal data
• Correct inaccurate data
• Request deletion of your data
• Object to data processing
• Data portability
• Withdraw consent at any time`,
		},
		{
			title: "Contact Us",
			content: `If you have questions about this Privacy Policy, please contact us at:

Email: privacy@finova.com
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
								Privacy <span className="italic-accent">Policy</span>
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
								At Finova, we are committed to protecting your privacy and
								ensuring the security of your personal information. This Privacy
								Policy explains how we collect, use, disclose, and safeguard
								your information when you use our services.
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
