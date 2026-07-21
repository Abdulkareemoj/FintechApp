import type { ReactNode } from "react";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

type AuthLayoutProps = {
	children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
	return (
		<>
			<Header />
			<div className="mx-auto flex min-h-svh max-w-6xl flex-col pt-4">
				<main className="flex flex-1 items-center justify-center bg-muted px-4 py-8">
					<div className="w-full max-w-sm md:max-w-4xl">{children}</div>
				</main>
				<Footer />
			</div>
		</>
	);
}
