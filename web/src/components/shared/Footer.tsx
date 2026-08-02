import { Link } from "@tanstack/react-router";
import { ModeToggle } from "./mode-toggle";
import { Logo } from "./Logo";

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
		<footer className="w-full border-t border-border bg-background">
			<div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
				<div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:gap-12">
					<div className="col-span-2 md:col-span-1">
						<Link to="/" className="mb-4 flex items-center gap-2">
							<Logo/>
							<span className="font-medium text-xl ">Finova</span>
						</Link>
						<p className="text-sm leading-relaxed ">
							Empowering you to take control of your finances, whether it's
							budgeting, saving, or investing.
						</p>
					</div>

					<div>
						<h3 className="mb-4 font-medium text-sm ">Company</h3>
						<ul className="space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<Link
										to={link.href}
										className="text-sm  transition-colors hover:text-[#3E6AE1]"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="mb-4 font-medium text-sm ">Product</h3>
						<ul className="space-y-3">
							{footerLinks.product.map((link) => (
								<li key={link.name}>
									<Link
										to={link.href}
										className="text-sm  transition-colors hover:text-[#3E6AE1]"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					<div>
						<h3 className="mb-4 font-medium text-sm ">Legal</h3>
						<ul className="space-y-3">
							{footerLinks.legal.map((link) => (
								<li key={link.name}>
									<Link
										to={link.href}
										className="text-sm  transition-colors hover:text-[#3E6AE1]"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				<div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
					<p className="text-sm ">
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
