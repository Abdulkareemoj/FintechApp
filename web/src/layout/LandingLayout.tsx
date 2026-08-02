import type { ReactNode } from "react";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

type LandingLayoutProps = {
	children: ReactNode;
};

export function LandingLayout({ children }: LandingLayoutProps) {
	return (
		<div className="tesla flex min-h-svh flex-col">
			<Header />
			<main className="flex-1">{children}</main>
			<Footer />
		</div>
	);
}
