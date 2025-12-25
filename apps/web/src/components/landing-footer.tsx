import { Link } from "@tanstack/react-router";

const footerLinks = [
  { title: "Product", links: ["Features", "Pricing", "Security"] },
  { title: "Company", links: ["About Us", "Careers", "Blog"] },
  { title: "Legal", links: ["Terms of Service", "Privacy Policy", "Cookie Policy"] },
  { title: "Support", links: ["Contact Us", "Help Center", "FAQ"] },
];

export function LandingFooter() {
  return (
    <footer className="border-t bg-background py-12">
      <div className="container grid grid-cols-2 gap-8 md:grid-cols-5">
        <div className="col-span-2 md:col-span-1">
          <Link to="/" className="text-2xl font-bold text-primary">
            Finpay
          </Link>
          <p className="text-muted-foreground mt-2 text-sm">
            The future of digital banking is here.
          </p>
          <p className="text-muted-foreground mt-4 text-xs">
            &copy; {new Date().getFullYear()} Finpay Inc.
          </p>
        </div>
        {footerLinks.map((section) => (
          <div key={section.title} className="flex flex-col space-y-3">
            <h3 className="text-sm font-semibold">{section.title}</h3>
            <ul className="space-y-2">
              {section.links.map((link) => (
                <li key={link}>
                  <Link
                    to={`/${link.toLowerCase().replace(/\s/g, "-")}` as any}
                    className="text-muted-foreground text-sm transition-colors hover:text-primary"
                  >
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  );
}