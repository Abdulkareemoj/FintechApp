import { createFileRoute } from "@tanstack/react-router";
import { Mail, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/layout/DashboardLayout";
import { useAuthStore } from "@/lib/authStore";

export const Route = createFileRoute("/(dashboard)/dashboard/profile")({
	component: ProfilePage,
});

function ProfilePage() {
	const user = useAuthStore((state) => state.user);
	const name =
		`${user?.firstName ?? ""} ${user?.lastName ?? ""}`.trim() || "Your profile";
	return (
		<DashboardLayout>
			<main className="min-h-screen bg-background px-6 py-8">
				<div className="mx-auto max-w-3xl space-y-6">
					<div className="flex items-center gap-3">
						<h1 className="font-bold text-3xl tracking-tight">
							Profile & verification
						</h1>
						<Badge variant="outline">Preview</Badge>
					</div>
					<p className="mt-1 text-muted-foreground">
						Your personal account information.
					</p>
					<Card>
						<CardHeader>
							<CardTitle>{name}</CardTitle>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="flex items-center gap-3">
								<Mail className="size-5 text-muted-foreground" />
								<div>
									<p className="text-muted-foreground text-sm">Email</p>
									<p className="font-medium">
										{user?.email ?? "Not available"}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-3">
								<ShieldCheck className="size-5 text-muted-foreground" />
								<div>
									<p className="text-muted-foreground text-sm">Verification</p>
									<Badge variant="outline">
										Preview — verification status is not connected
									</Badge>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</main>
		</DashboardLayout>
	);
}
