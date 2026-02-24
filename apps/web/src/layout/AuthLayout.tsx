import type { ReactNode } from "react";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";

type AuthLayoutProps = {
  children: ReactNode;
};

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="mx-auto flex min-h-svh max-w-6xl flex-col">
      <Header />
      <main className="bg-muted flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-sm md:max-w-4xl">{children}</div>
      </main>
      <Footer />
    </div>
  );
}
