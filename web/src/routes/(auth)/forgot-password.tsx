import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute, Link } from "@tanstack/react-router";
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
	type ForgotPasswordFormValues,
	forgotPasswordSchema,
} from "@/lib/schemas";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/(auth)/forgot-password")({
	component: ForgotPassword,
});

function ForgotPassword({ className, ...props }: React.ComponentProps<"div">) {
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const form = useForm<ForgotPasswordFormValues>({
		resolver: zodResolver(forgotPasswordSchema),
		mode: "onTouched",
		defaultValues: { email: "" },
	});

	const onSubmit = async (values: ForgotPasswordFormValues) => {
		setIsSubmitting(true);
		setError(null);
		try {
			const res = await apiClient.post<{ success: boolean; message?: string }>(
				"/api/auth/forgot-password",
				{
					email: values.email,
				},
			);

			toast.success(
				res.data.message ?? "If that email exists, a reset link has been sent.",
			);
			form.reset({ email: "" });
		} catch {
			setError("Failed to send password reset email");
			toast.error("Failed to send password reset email");
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
											<h1 className="font-bold text-2xl">
												Forgot your password?
											</h1>
											<p className="text-balance text-muted-foreground">
												Enter your email to reset your password
											</p>
										</div>
										{error && (
											<Alert variant="destructive">
												<AlertTitle>Request failed</AlertTitle>
												<AlertDescription>{error}</AlertDescription>
											</Alert>
										)}
										<Controller
											control={form.control}
											name="email"
											render={({ field, fieldState }) => (
												<Field data-invalid={fieldState.invalid}>
													<FieldLabel htmlFor={field.name}>Email</FieldLabel>
													<Input
														{...field}
														aria-invalid={fieldState.invalid}
														autoComplete="email"
														disabled={isSubmitting}
														id={field.name}
														type="email"
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
											{isSubmitting
												? "Sending..."
												: "Send password reset email"}
										</Button>
										<div className="text-center text-sm">
											Remember your password?
											<Link
												className="underline underline-offset-4"
												to="/signin"
											>
												Sign in
											</Link>
										</div>
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
