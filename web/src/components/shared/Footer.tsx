import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";

const Footer = () => {
	const footerLinks = {
		company: [
			{ name: "About Us", href: "/about" },
			{ name: "Contact Us", href: "/contact" },
		],
		product: [
			{ name: "Features", href: "/features" },
			{ name: "How it Works", href: "/how-it-works" },
			{ name: "Security", href: "/security" },
		],
		legal: [
			{ name: "Privacy Policy", href: "/privacy-policy" },
			{ name: "Terms of Service", href: "/terms-of-service" },
		],
	};

	return (
		<footer className="border-t border-teal-800/30 bg-[#023247]">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
					<div className="col-span-2 md:col-span-1">
						<Link to="/" className="mb-4 flex items-center gap-2">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
								<span className="font-bold text-sm text-white">
									F
								</span>
							</div>
							<span className="font-semibold text-xl text-white">
								Finova
							</span>
						</Link>
						<p className="text-sm leading-relaxed text-teal-100/60">
							Empowering you to take control of your finances—whether it's
							budgeting, saving, or investing.
						</p>
					</div>

					<div>
						<h3 className="mb-4 font-semibold text-white">Company</h3>
						<ul className="space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<Link
										to={link.href}
										className="text-sm text-teal-100/60 transition-colors hover:text-teal-300"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="mb-4 font-semibold text-white">Product</h3>
						<ul className="space-y-3">
							{footerLinks.product.map((link) => (
								<li key={link.name}>
									<Link
										to={link.href}
										className="text-sm text-teal-100/60 transition-colors hover:text-teal-300"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="mb-4 font-semibold text-white">Legal</h3>
						<ul className="space-y-3">
							{footerLinks.legal.map((link) => (
								<li key={link.name}>
									<Link
										to={link.href}
										className="text-sm text-teal-100/60 transition-colors hover:text-teal-300"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-teal-800/30 pt-8 sm:flex-row">
					<p className="text-sm text-teal-100/60">
						&copy; 2026 Finova. All Rights Reserved.
					</p>
					<div className="flex items-center gap-4">
						<ModeToggle />
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
