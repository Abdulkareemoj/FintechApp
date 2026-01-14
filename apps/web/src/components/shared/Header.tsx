import { useScroll } from "@/hooks/use-scroll";
import { Logo } from "./Logo";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { MobileNav } from "./MobileNav";
import { Link } from "@tanstack/react-router";

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
  {
		label: "Blog",
		href: "#",
	},
  {
		label: "FAQ",
		href: "#",
	},  
  {
		label: "Support",
		href: "#",
	},  
  {
		label: "How it Works",
		href: "/how-it-works",
	},  
];

export function Header() {
	const scrolled = useScroll(10);

	return (
		<header
			className={cn(
				"sticky top-0 z-50 mx-auto w-full max-w-4xl border-transparent border-b md:rounded-md md:border md:transition-all md:ease-out",
				{
					"border-border bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/50 md:top-2 md:max-w-3xl md:shadow":
						scrolled,
				}
			)}
		>
			<nav
				className={cn(
					"flex h-14 w-full items-center justify-between px-4 md:h-12 md:transition-all md:ease-out",
					{
						"md:px-2": scrolled,
					}
				)}
			>
				<Link className="rounded-md p-2 hover:bg-accent h-4.5" to="/">
					<Logo  />
				</Link>
				<div className="hidden items-center gap-1 md:flex">
					{navLinks.map((link, i) => (
						<Link
							className={buttonVariants({ variant: "ghost" })}
							to={link.href}
							key={i}
						>
							{link.label}
						</Link>
					))}
					<Button variant="outline">Sign In</Button>
					<Button>Get Started</Button>
				</div>
				<MobileNav />
			</nav>
		</header>
	);
}
