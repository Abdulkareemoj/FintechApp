import type { ReactNode } from "react";

import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";

type LandingLayoutProps = {
  children: ReactNode;
};

export function LandingLayout({ children }: LandingLayoutProps) {
  return (
    <div className="flex min-h-svh flex-col">     
     {/* <div className="min-h-screen bg-background"> */}
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
