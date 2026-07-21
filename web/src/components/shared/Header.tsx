import { Link, useLocation } from "@tanstack/react-router";
import { Button, buttonVariants } from "@/components/ui/button";
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
				"sticky top-0 z-50 mx-auto w-full border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out",
				{
					"border-border bg-background/80 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-6xl md:shadow-sm":
						scrolled,
				},
			)}
		>
			<nav
				className={cn(
					"mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
					{
						"md:px-2": scrolled,
					},
				)}
			>
				<Link
					className="flex items-center gap-4 rounded-md p-2 hover:bg-accent/50"
					to="/"
				>
					<Logo />
				</Link>

				<div className="hidden items-center justify-center gap-1 md:flex">
					{navLinks.map((link) => (
						<Link
							key={link.href}
							to={link.href}
							className={buttonVariants({
								variant: "ghost",
								className: cn(
									"relative",
									location.pathname === link.href &&
										"text-primary after:absolute after:-bottom-1 after:left-1/2 after:h-0.5 after:w-1/2 after:-translate-x-1/2 after:rounded-full after:bg-primary",
								),
							})}
						>
							{link.label}
						</Link>
					))}
				</div>

				<div className="hidden items-center gap-3 md:flex">
					<Button variant="outline" asChild>
						<Link to="/signin">Sign In</Link>
					</Button>
					<Button asChild>
						<Link to="/signup">Get Started</Link>
					</Button>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}
