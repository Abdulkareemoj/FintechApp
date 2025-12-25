import type { ReactNode } from "react";
import { LandingFooter } from "@/components/ui/landing-footer";
import { LandingNavbar } from "@/components/ui/landing-navbar";

type LandingLayoutProps = {
  children: ReactNode;
};

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col">
      <LandingNavbar />
      <main className="flex-1">{children}</main>
      <LandingFooter />
    </div>
  );
}
