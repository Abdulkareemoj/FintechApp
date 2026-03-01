import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import axios from "axios";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import AuthLayout from "@/layout/AuthLayout";
import { apiClient } from "@/lib/apiClient";
import {
	type ResetPasswordFormValues,
	resetPasswordSchema,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(auth)/reset-password")({
	component: ResetPassword,
});

function ResetPassword({ className, ...props }: React.ComponentProps<"div">) {
	const router = useRouter();
	const { token } = Route.useSearch() as { token: string };

	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<ResetPasswordFormValues>({
		resolver: zodResolver(resetPasswordSchema),
		mode: "onTouched",
		defaultValues: { password: "", confirmPassword: "" },
	});

	const onSubmit = async (values: ResetPasswordFormValues) => {
		setIsSubmitting(true);
		setError(null);
		try {
			if (!token) {
				throw new Error("Missing reset token");
			}

			const res = await apiClient.post<{ success: boolean; message?: string }>(
				"/api/auth/reset-password",
				{
					token,
					newPassword: values.password,
					confirmPassword: values.confirmPassword,
				},
			);

			toast.success(
				res.data.message ?? "Password reset successfully. Please sign in.",
			);
			router.navigate({ to: "/signin" });
		} catch (err) {
			if (axios.isAxiosError(err)) {
				const msg =
					(err.response?.data as any)?.error ??
					err.response?.statusText ??
					err.message ??
					"Password reset failed";
				setError(msg);
				toast.error(msg);
				return;
			}

			const msg = err instanceof Error ? err.message : "Password reset failed";
			setError(msg);
			toast.error(msg);
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<AuthLayout>
			<div className={cn("flex flex-col gap-6", className)} {...props}>
				<div className="w-full max-w-sm md:max-w-3xl">
					<div className={cn("flex flex-col gap-6", className)} {...props}>
						<Card className="overflow-hidden p-0">
							<CardContent className="grid p-0 md:grid-cols-2">
								<form
									className="p-6 md:p-8"
									onSubmit={form.handleSubmit(onSubmit)}
								>
									<FieldGroup>
										<div className="flex flex-col items-center text-center">
											<h1 className="font-bold text-2xl">Reset Password</h1>
											<p className="text-balance text-muted-foreground">
												Enter your new password
											</p>
										</div>
										{error && (
											<Alert variant="destructive">
												<AlertTitle>Reset failed</AlertTitle>
												<AlertDescription>{error}</AlertDescription>
											</Alert>
										)}
										<Controller
											control={form.control}
											name="password"
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor={field.name}>
														New Password
													</FieldLabel>
													<Input
														{...field}
														aria-invalid={fieldState.invalid}
														autoComplete="new-password"
														disabled={isSubmitting}
														id={field.name}
														type="password"
													/>
													{fieldState.invalid && (
														<FieldError errors={[fieldState.error]} />
													)}
												</Field>
											)}
										/>
										<Controller
											control={form.control}
											name="confirmPassword"
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor={field.name}>
														Confirm New Password
													</FieldLabel>
													<Input
														{...field}
														aria-invalid={fieldState.invalid}
														autoComplete="new-password"
														disabled={isSubmitting}
														id={field.name}
														type="password"
													/>
													{fieldState.invalid && (
														<FieldError errors={[fieldState.error]} />
													)}
												</Field>
											)}
										/>
										<Button
											className="w-full"
											disabled={isSubmitting}
											type="submit"
										>
											{isSubmitting ? "Resetting..." : "Reset Password"}
										</Button>
									</FieldGroup>
								</form>
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
				</div>
			</div>
		</AuthLayout>
	);
}
