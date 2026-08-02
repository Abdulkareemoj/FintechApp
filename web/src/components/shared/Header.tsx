import { Link, useLocation } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { useScroll } from "@/hooks/use-scroll";
import { cn } from "@/lib/utils";
import { Logo } from "./Logo";
import { MobileNav } from "./MobileNav";

export const navLinks = [
	{
		label: "Features",
		href: "/features",
	},
	{
		label: "How it Works",
		href: "/how-it-works",
	},
	{
		label: "Security",
		href: "/security",
	},
	{
		label: "About",
		href: "/about",
	},
	{
		label: "Contact",
		href: "/contact",
	},
];

export default function Header() {
	const scrolled = useScroll(10);
	const location = useLocation();

	return (
		<header
			className={cn(
				"sticky top-0 z-50 w-full border-b border-border bg-background/75 backdrop-blur-xl transition-all duration-500",
				scrolled && "bg-background/90",
			)}
		>
			<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
				<nav className="flex h-16 items-center justify-between">
					<Link
						className="flex items-center gap-2 p-2 transition-opacity duration-500 hover:opacity-80"
						to="/"
					>
						<Logo />
					</Link>

					<div className="hidden items-center justify-center gap-1 md:flex">
						{navLinks.map((link) => (
							<Link
								key={link.href}
								to={link.href}
								className={cn(
									"min-h-8 rounded px-4 py-1 text-sm font-medium transition-colors duration-300",
									location.pathname === link.href
										? "bg-muted text-primary"
										: "text-foreground hover:bg-muted",
								)}
							>
								{link.label}
							</Link>
						))}
					</div>

					<div className="hidden items-center gap-3 md:flex">
						<Button
							variant="ghost"
							className="text-sm font-medium text-foreground transition-colors duration-300 hover:bg-muted"
							asChild
						>
							<Link to="/signin">Sign In</Link>
						</Button>
						<Button
							className="min-h-10  rounded bg-primary text-sm font-medium text-white transition-colors duration-300 hover:bg-primary/90"
							asChild
						>
							<Link to="/signup">Get Started</Link>
						</Button>
					</div>

					<MobileNav />
				</nav>
			</div>
		</header>
	);
}
