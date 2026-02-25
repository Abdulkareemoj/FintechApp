import { Link } from "@tanstack/react-router";
import { Github, Linkedin, Twitter } from "lucide-react";
import { ModeToggle } from "./mode-toggle";

const Footer = () => {
	const footerLinks = {
		company: [
			{ name: "About Us", href: "/about" },
			{ name: "Careers", href: "/careers" },
			{ name: "Contact Us", href: "/contact" },
			{ name: "Resources", href: "/resources" },
		],
		product: [
			{ name: "Features", href: "/features" },
			{ name: "Pricing", href: "/pricing" },
			{ name: "How it Works", href: "/how-it-works" },
			{ name: "Security", href: "/security" },
		],
		legal: [
			{ name: "Privacy Policy", href: "/privacy" },
			{ name: "Terms of Service", href: "/terms" },
			{ name: "Cookie Policy", href: "/cookies" },
		],
	};

	return (
		<footer className="bg-card border-t border-border">
			<div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
					{/* Brand */}
					<div className="col-span-2 md:col-span-1">
						<Link to="/" className="flex items-center gap-2 mb-4">
							<div className="w-8 h-8 rounded-lg bg-gradient-primary flex items-center justify-center">
								<span className="text-primary-foreground font-bold text-sm">
									F
								</span>
							</div>
							<span className="text-xl font-semibold text-foreground">
								Finova
							</span>
						</Link>
						<p className="text-sm text-muted-foreground leading-relaxed">
							Empowering you to take control of your finances—whether it's
							budgeting, saving, or investing.
						</p>
					</div>

					{/* Company */}
					<div>
						<h3 className="font-semibold text-foreground mb-4">Company</h3>
						<ul className="space-y-3">
							{footerLinks.company.map((link) => (
								<li key={link.name}>
									<Link
										to={link.href}
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Product */}
					<div>
						<h3 className="font-semibold text-foreground mb-4">Product</h3>
						<ul className="space-y-3">
							{footerLinks.product.map((link) => (
								<li key={link.name}>
									<Link
										to={link.href}
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>

					{/* Legal */}
					<div>
						<h3 className="font-semibold text-foreground mb-4">Legal</h3>
						<ul className="space-y-3">
							{footerLinks.legal.map((link) => (
								<li key={link.name}>
									<Link
										to={link.href}
										className="text-sm text-muted-foreground hover:text-primary transition-colors"
									>
										{link.name}
									</Link>
								</li>
							))}
						</ul>
					</div>
				</div>

				{/* Bottom */}
				<div className="mt-12 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
					<p className="text-sm text-muted-foreground">
						© 2026 Finova. All Rights Reserved.
					</p>
					<div className="flex items-center gap-4">
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Twitter className="w-5 h-5" />
						</a>
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Linkedin className="w-5 h-5" />
						</a>
						<a
							href="#"
							className="text-muted-foreground hover:text-primary transition-colors"
						>
							<Github className="w-5 h-5" />
						</a>
						<ModeToggle />
					</div>
				</div>
			</div>
		</footer>
	);
};

export default Footer;
