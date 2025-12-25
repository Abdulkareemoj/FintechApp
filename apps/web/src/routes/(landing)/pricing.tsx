import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/pricing")({
  component: PricingPage,
});

function PricingPage() {
  return (
    <LandingLayout>
      <div className="container py-20 text-center">
        <h1 className="font-bold text-4xl">Simple, Transparent Pricing</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Find the perfect plan for your financial needs.
        </p>
        <div className="mt-12">
          {/* Pricing cards would go here */}
          <div className="mx-auto flex h-64 w-full max-w-3xl items-center justify-center rounded-lg border border-dashed bg-muted/50">
            <p className="text-muted-foreground">Pricing Plans Placeholder</p>
          </div>
        </div>
      </div>
    </LandingLayout>
  );
}
