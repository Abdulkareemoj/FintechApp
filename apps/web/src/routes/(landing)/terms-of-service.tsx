import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/terms-of-service")({
  component: TermsOfServicePage,
});

function TermsOfServicePage() {
  return (
    <LandingLayout>
      <div className="container mx-auto max-w-4xl py-20">
        <h1 className="font-bold text-4xl">Terms of Service</h1>
        <p className="mt-4 text-muted-foreground">
          Last updated: October 26, 2023
        </p>
        <div className="mt-8 space-y-6 text-sm">
          <h2 className="font-semibold text-2xl">1. Acceptance of Terms</h2>
          <p>
            By accessing and using the Finpay service ("Service"), you accept
            and agree to be bound by the terms and provisions of this agreement.
            If you do not agree to abide by the above, please do not use this
            Service.
          </p>
          <h2 className="font-semibold text-2xl">2. Description of Service</h2>
          <p>
            Finpay provides digital banking and financial management tools. You
            are responsible for obtaining access to the Service and that access
            may involve third-party fees (such as Internet service provider or
            airtime charges).
          </p>
          <h2 className="font-semibold text-2xl">3. User Conduct</h2>
          <p>
            You agree to not use the Service for any illegal or unauthorized
            purpose. You must not, in the use of the Service, violate any laws
            in your jurisdiction (including but not limited to copyright laws).
          </p>
        </div>
      </div>
    </LandingLayout>
  );
}
