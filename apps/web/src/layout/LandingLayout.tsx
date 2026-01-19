import type { ReactNode } from "react";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

type LandingLayoutProps = {
  children: ReactNode;
};

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col">
      {/* <div className="min-h-screen bg-background"> */}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
