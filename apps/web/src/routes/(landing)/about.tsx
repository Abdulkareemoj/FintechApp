import { createFileRoute } from "@tanstack/react-router";
import { LandingLayout } from "@/layout/LandingLayout";

export const Route = createFileRoute("/(landing)/about")({
  component: AboutPage,
});

function AboutPage() {
  return (
    <LandingLayout>
      <div className="container py-20">
        <h1 className="font-bold text-4xl">About Finpay</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Our mission is to empower people to achieve financial freedom.
        </p>
        <div className="mt-8 space-y-6">
          <p>
            Founded in 2023, Finpay set out to disrupt traditional banking by
            offering a fully digital, secure, and user-friendly platform. We
            believe that managing your money should be simple, intuitive, and
            accessible to everyone.
          </p>
          <p>
            Our team of financial experts and technology innovators works
            tirelessly to bring you the best tools for budgeting, saving, and
            investing. We are committed to transparency, security, and putting
            our users first.
          </p>
        </div>
      </div>
    </LandingLayout>
  );
}
