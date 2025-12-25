import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)/unauthorized")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-muted p-6">
      <div className="text-center">
        <h1 className="font-bold text-2xl">Unauthorized</h1>
        <p className="mt-2 text-muted-foreground">
          You don&apos;t have access to view this page.
        </p>
      </div>
    </div>
  );
}
