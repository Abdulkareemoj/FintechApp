import { createFileRoute, Link } from "@tanstack/react-router";
import axios from "axios";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import AuthLayout from "@/layout/AuthLayout";
import { apiClient } from "@/lib/apiClient";

export const Route = createFileRoute("/(auth)/verify")({
	component: VerifyPage,
});

function VerifyPage() {
	const search = Route.useSearch() as { token?: string };
	const token = search.token;

	const [status, setStatus] = useState<
		"idle" | "verifying" | "success" | "error"
	>("idle");
	const [error, setError] = useState<string | null>(null);

	const verify = useCallback(async () => {
		if (!token) {
			setStatus("error");
			setError("Missing verification token");
			return;
		}

		setStatus("verifying");
		setError(null);

		try {
			const res = await apiClient.post<{ success: boolean; message?: string }>(
				"/api/auth/verify-email",
				{ token },
			);

			setStatus("success");
			toast.success(res.data.message ?? "Email verified successfully");
		} catch (err) {
			setStatus("error");
			if (axios.isAxiosError(err)) {
				const data = err.response?.data as { error?: string } | undefined;
				const msg =
					data?.error ??
					err.response?.statusText ??
					err.message ??
					"Verification failed";
				setError(msg);
				toast.error(msg);
			} else {
				setError("Verification failed");
				toast.error("Verification failed");
			}
		}
	}, [token]);

	useEffect(() => {
		verify().catch(() => {
			// errors handled in verify
		});
	}, [verify]);

	const description = useMemo(() => {
		if (status === "verifying") {
			return "Verifying your email...";
		}
		if (status === "success") {
			return "Your email has been verified.";
		}
		return "We couldn't verify your email.";
	}, [status]);

	return (
		<AuthLayout>
			<div className="w-full max-w-sm md:max-w-3xl">
				<Card className="overflow-hidden p-0">
					<CardContent className="grid p-0 md:grid-cols-2">
						<div className="p-6 md:p-8">
							<div className="flex flex-col gap-6">
								<div className="flex flex-col items-center text-center">
									<h1 className="font-bold text-2xl">Verify your email</h1>
									<p className="text-balance text-muted-foreground">
										{description}
									</p>
								</div>

								{status === "error" && (
									<Alert variant="destructive">
										<AlertTitle>Verification failed</AlertTitle>
										<AlertDescription>
											{error ?? "Verification failed"}
										</AlertDescription>
									</Alert>
								)}

								<div className="flex flex-col gap-3">
									<Button
										className="w-full"
										disabled={status === "verifying"}
										onClick={() => {
											verify().catch(() => {
												// errors handled in verify
											});
										}}
										type="button"
									>
										{status === "verifying" ? "Verifying..." : "Retry"}
									</Button>
									<Button asChild className="w-full" variant="outline">
										<Link to="/signin">Go to Sign in</Link>
									</Button>
								</div>
							</div>
						</div>
						<div className="relative hidden bg-muted md:block">
							<img
								alt="Image"
								className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
								src="/placeholder.svg"
							/>
						</div>
					</CardContent>
				</Card>
			</div>
		</AuthLayout>
	);
}
