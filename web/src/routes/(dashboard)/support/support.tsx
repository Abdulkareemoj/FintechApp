import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(dashboard)/support/support")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/(dashboard)/support/support"!</div>;
}
