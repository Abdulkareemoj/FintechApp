import { createFileRoute } from "@tanstack/react-router";
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
			<main>
				{/* Header */}
				<section className="border-b border-border bg-background py-24">
					<div className="mx-auto max-w-3xl px-4 sm:px-6">
						<h1 className="text-[40px] font-medium text-foreground">
							Privacy Policy
						</h1>
						<p className="mt-3 text-sm text-muted-foreground">
							Last updated: January 13, 2026
						</p>
					</div>
				</section>

				{/* Content */}
				<section className="bg-background py-20">
					<div className="mx-auto max-w-3xl px-4 sm:px-6">
						<p className="mb-14 text-sm leading-relaxed text-muted-foreground">
							At Finova, we are committed to protecting your privacy and
							ensuring the security of your personal information. This Privacy
							Policy explains how we collect, use, disclose, and safeguard your
							information when you use our services.
						</p>

						{sections.map((section) => (
							<div key={section.title} className="mb-10">
								<h2 className="mb-4 text-[17px] font-medium text-foreground">
									{section.title}
								</h2>
								<div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line">
									{section.content}
								</div>
							</div>
						))}
					</div>
				</section>
			</main>
		</LandingLayout>
	);
}
