import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/privacy-policy")({
  component: PrivacyPolicyPage,
});

function PrivacyPolicyPage() {
  return (
    <LandingLayout>
      <div className="container mx-auto max-w-4xl py-20">
        <h1 className="font-bold text-4xl">Privacy Policy</h1>
        <p className="mt-4 text-muted-foreground">
          Last updated: October 26, 2023
        </p>
        <div className="mt-8 space-y-6 text-sm">
          <h2 className="font-semibold text-2xl">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you
            create an account, request customer support, or otherwise
            communicate with us. This may include your name, email address,
            phone number, and financial information.
          </p>
          <h2 className="font-semibold text-2xl">
            2. How We Use Your Information
          </h2>
          <p>
            We use the information we collect to provide, maintain, and improve
            our Service, to process transactions, to send you technical notices,
            updates, security alerts, and support messages, and to monitor and
            analyze trends, usage, and activities in connection with our
            Service.
          </p>
          <h2 className="font-semibold text-2xl">3. Security</h2>
          <p>
            We take reasonable measures to help protect information about you
            from loss, theft, misuse and unauthorized access, disclosure,
            alteration, and destruction.
          </p>
        </div>
      </div>
    </LandingLayout>
  );
}
