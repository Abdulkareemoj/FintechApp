import { createFileRoute, Link } from "@tanstack/react-router";
import {
	Calendar,
	IdCard,
	Mail,
	MapPin,
	Phone,
	ShieldCheck,
} from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useProfile } from "@/hooks/useProfile";
import DashboardLayout from "@/layout/DashboardLayout";

export const Route = createFileRoute("/(dashboard)/dashboard/profile")({
	component: ProfilePage,
});

function formatDate(value: string | null | undefined): string {
	if (!value) return "Not provided";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "Not provided";
	return date.toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
}

function ProfileRow({
	icon,
	label,
	children,
}: {
	icon: ReactNode;
	label: string;
	children: ReactNode;
}) {
	return (
		<div className="flex items-center gap-3">
			<span className="text-muted-foreground">{icon}</span>
			<div>
				<p className="text-muted-foreground text-sm">{label}</p>
				<div className="font-medium">{children}</div>
			</div>
		</div>
	);
}

function ProfilePage() {
	const profileQuery = useProfile();
	const profile = profileQuery.data;

	const name = profile
		? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim()
		: "Your profile";

	return (
		<DashboardLayout>
			<main className="min-h-screen bg-background px-6 py-8">
				<div className="mx-auto max-w-3xl space-y-6">
					<div className="flex flex-wrap items-center justify-between gap-3">
						<div>
							<h1 className="font-bold text-3xl tracking-tight">
								Profile & verification
							</h1>
							<p className="mt-1 text-muted-foreground">
								Your personal account information.
							</p>
						</div>
						<Link
							className={buttonVariants({ variant: "outline" })}
							to="/dashboard/settings"
						>
							Edit Profile
						</Link>
					</div>

					{profileQuery.isPending ? (
						<Card>
							<CardHeader>
								<Skeleton className="h-6 w-48" />
							</CardHeader>
							<CardContent className="space-y-4">
								{Array.from({ length: 5 }).map((_, i) => (
									<Skeleton
										className="h-5 w-full"
										key={`row-${i.toString()}`}
									/>
								))}
							</CardContent>
						</Card>
					) : profileQuery.isError ? (
						<Card>
							<CardContent className="space-y-4 py-8 text-center">
								<p className="text-muted-foreground text-sm">
									Couldn&apos;t load your profile.
								</p>
								<Button
									onClick={() => profileQuery.refetch()}
									size="sm"
									variant="outline"
								>
									Try again
								</Button>
							</CardContent>
						</Card>
					) : profile ? (
						<>
							<Card>
								<CardHeader>
									<div className="flex flex-wrap items-center justify-between gap-2">
										<div>
											<CardTitle>{name}</CardTitle>
											<CardDescription>{profile.email}</CardDescription>
										</div>
										<Badge
											variant={profile.emailVerified ? "default" : "outline"}
										>
											{profile.emailVerified
												? "Email verified"
												: "Email not verified"}
										</Badge>
									</div>
								</CardHeader>
								<CardContent className="space-y-4">
									<ProfileRow icon={<Mail className="size-5" />} label="Email">
										{profile.email}
									</ProfileRow>
									<ProfileRow icon={<Phone className="size-5" />} label="Phone">
										{profile.phone || "Not provided"}
									</ProfileRow>
									<ProfileRow
										icon={<MapPin className="size-5" />}
										label="Address"
									>
										{profile.address || "Not provided"}
									</ProfileRow>
									<ProfileRow
										icon={<Calendar className="size-5" />}
										label="Date of birth"
									>
										{formatDate(profile.dateOfBirth)}
									</ProfileRow>
									<ProfileRow
										icon={<IdCard className="size-5" />}
										label="Member since"
									>
										{formatDate(profile.createdAt)}
									</ProfileRow>
								</CardContent>
							</Card>

							<Card>
								<CardHeader>
									<div className="flex items-center gap-2">
										<CardTitle>Identity verification</CardTitle>
										<Badge variant="outline">Preview</Badge>
									</div>
									<CardDescription>
										KYC verification status is not connected yet
									</CardDescription>
								</CardHeader>
								<CardContent className="flex items-center gap-3">
									<ShieldCheck className="size-5 text-muted-foreground" />
									<p className="text-muted-foreground text-sm">
										Verification status will appear here once identity
										verification is available.
									</p>
								</CardContent>
							</Card>
						</>
					) : null}
				</div>
			</main>
		</DashboardLayout>
	);
}
