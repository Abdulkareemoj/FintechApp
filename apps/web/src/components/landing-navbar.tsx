import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/mode-toggle";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/pricing", label: "Pricing" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link className="font-bold text-primary text-xl" to="/">
            Finpay
          </Link>
          <nav className="hidden space-x-6 md:flex">
            {navLinks.map((link) => (
              <Link
                className="font-medium text-muted-foreground text-sm transition-colors hover:text-primary"
                key={link.to}
                to={link.to as any}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex items-center space-x-3">
          <ModeToggle />
          <Button asChild size="sm" variant="ghost">
            <Link className="font-medium text-sm" to="/auth/signin">
              Sign In
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link className="font-medium text-sm" to="/auth/signup">
              Sign Up
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
