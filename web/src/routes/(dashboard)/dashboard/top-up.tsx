// ================================================================
// FILE: src/routes/(dashboard)/dashboard/top-up.tsx
// ================================================================

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Building2,
	CheckCircle2,
	Clock,
	CreditCard,
	DollarSign,
	Shield,
	Smartphone,
	Wallet,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { AnimatedNumber } from "@/components/shared/AnimatedNumber";
import { SuccessCheck } from "@/components/shared/SuccessCheck";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Field,
	FieldContent,
	FieldError,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { MoneyRequestsPanel } from "@/components/user-dashboard/MoneyRequestsPanel";
import {
	useDepositStatus,
	useInitiateDeposit,
	useSimulateDepositCallback,
} from "@/hooks/useDeposits";
import { useTransactions } from "@/hooks/useTransactions";
import { useWallets } from "@/hooks/useWallets";
import DashboardLayout from "@/layout/DashboardLayout";
import type { DepositSource } from "@/lib/api/deposits";
import { generateIdempotencyKey } from "@/lib/idempotency";

export const Route = createFileRoute("/(dashboard)/dashboard/top-up")({
	component: RouteComponent,
});

const quickAmounts = [25, 50, 100, 250, 500, 1000];

const topUpMethods: {
	id: DepositSource;
	icon: any;
	label: string;
	description: string;
	badge: string;
}[] = [
	{
		id: "DebitCard",
		icon: CreditCard,
		label: "Debit/Credit Card",
		description: "Simulated · Instant",
		badge: "Instant",
	},
	{
		id: "BankTransfer",
		icon: Building2,
		label: "Bank Transfer",
		description: "Simulated · 1-3 business days",
		badge: "Standard",
	},
	{
		id: "USSD",
		icon: Smartphone,
		label: "USSD",
		description: "Simulated · Instant",
		badge: "Instant",
	},
];

const topUpSchema = z.object({
	walletId: z.string().min(1, "Select an account"),
	amount: z.coerce.number().positive("Amount must be greater than 0"),
	source: z.enum(["BankTransfer", "DebitCard", "USSD", "Other"]),
});
type TopUpForm = z.infer<typeof topUpSchema>;
type FormInput = z.input<typeof topUpSchema>; // amount: unknown — what the fields are typed as
type FormOutput = z.output<typeof topUpSchema>; // amount: number — what onSubmit receives

function RouteComponent() {
	const { data: wallets } = useWallets();
	const primaryWallet = wallets?.[0];
	const { data: recentTopUps } = useTransactions({
		type: "Deposit",
		pageSize: 5,
	});

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		formState: { errors, isSubmitting },
	} = useForm<FormInput, any, FormOutput>({
		resolver: zodResolver(topUpSchema),
		defaultValues: { walletId: "", amount: 0, source: "DebitCard" },
	});

	useEffect(() => {
		if (primaryWallet) setValue("walletId", primaryWallet.id);
	}, [primaryWallet, setValue]);

	const amount = watch("amount");

	const [activeDepositId, setActiveDepositId] = useState<string | null>(null);
	const initiateDeposit = useInitiateDeposit();
	const { data: depositStatus } = useDepositStatus(
		activeDepositId ?? undefined,
	);
	const simulateCallback = useSimulateDepositCallback();

	const onSubmit = async (values: TopUpForm) => {
		try {
			const deposit = await initiateDeposit.mutateAsync({
				idempotencyKey: generateIdempotencyKey(),
				walletId: values.walletId,
				amount: values.amount,
				source: values.source,
			});
			setActiveDepositId(deposit.id);
			toast.success(`Deposit initiated — reference ${deposit.referenceId}`);
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to start deposit",
			);
		}
	};

	const handleSimulate = async (success: boolean) => {
		if (!activeDepositId) return;
		try {
			await simulateCallback.mutateAsync({
				depositId: activeDepositId,
				success,
			});
			toast.success(success ? "Deposit completed" : "Deposit marked failed");
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to update deposit",
			);
		}
	};

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
					>
						<h1 className="text-3xl font-bold tracking-tight">Top Up</h1>
						<p className="text-muted-foreground mt-1">
							Add funds to your wallet
						</p>
					</motion.div>

					<div className="grid gap-6 lg:grid-cols-3">
						<motion.div
							className="lg:col-span-2 space-y-6"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.1 }}
						>
							{activeDepositId && depositStatus && (
								<Card className="border-primary/30 bg-primary/5 shadow-card">
									<CardContent className="p-6 space-y-3">
										<div className="flex items-center gap-3">
											{depositStatus.status === "Pending" ? (
												<Clock className="h-5 w-5 text-warning" />
											) : depositStatus.status === "Completed" ? (
												<SuccessCheck className="size-6 text-success" />
											) : (
												<CheckCircle2 className="h-5 w-5 text-destructive" />
											)}
											<div>
												<p className="font-medium">
													Deposit{" "}
													{depositStatus.status === "Pending"
														? "pending"
														: depositStatus.status.toLowerCase()}
												</p>
												<p className="text-muted-foreground text-sm">
													<AnimatedNumber
														value={`${depositStatus.currency} ${depositStatus.amount.toFixed(2)}`}
													/>
												</p>
											</div>
										</div>

										{depositStatus.status === "Pending" &&
											import.meta.env.DEV && (
												<div className="flex gap-2 pt-2">
													<Button
														size="sm"
														variant="outline"
														onClick={() => handleSimulate(true)}
													>
														Simulate success (dev)
													</Button>
													<Button
														size="sm"
														variant="outline"
														onClick={() => handleSimulate(false)}
													>
														Simulate failure (dev)
													</Button>
												</div>
											)}
									</CardContent>
								</Card>
							)}

							<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
								<Card className="bg-card-gradient shadow-card border-border/50">
									<CardHeader>
										<CardTitle className="flex items-center gap-2">
											<Wallet className="h-5 w-5 text-primary" />
											Select Account
										</CardTitle>
									</CardHeader>
									<CardContent>
										<Controller
											control={control}
											name="walletId"
											render={({ field, fieldState }) => (
												<Field data-invalid={!!fieldState.error}>
													<Select
														value={field.value}
														onValueChange={field.onChange}
													>
														<SelectTrigger className="bg-muted/50">
															<SelectValue />
														</SelectTrigger>
														<SelectContent>
															{wallets?.map((w) => (
																<SelectItem key={w.id} value={w.id}>
																	{w.currencyCode} Wallet — {w.currencyCode}{" "}
																	{w.balance.toLocaleString(undefined, {
																		minimumFractionDigits: 2,
																	})}
																</SelectItem>
															))}
														</SelectContent>
													</Select>
													<FieldError
														errors={fieldState.error ? [fieldState.error] : []}
													/>
												</Field>
											)}
										/>
									</CardContent>
								</Card>

								<Card className="bg-card-gradient shadow-card border-border/50">
									<CardHeader>
										<CardTitle className="text-base">Enter Amount</CardTitle>
									</CardHeader>
									<CardContent className="space-y-4">
										<Field data-invalid={!!errors.amount}>
											<FieldContent>
												<div className="relative">
													<DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
													<Input
														type="number"
														step="0.01"
														placeholder="0.00"
														aria-invalid={!!errors.amount}
														className="pl-12 text-3xl font-bold h-16 bg-muted/50 number-display"
														{...register("amount")}
													/>
												</div>
												<FieldError
													errors={errors.amount ? [errors.amount] : []}
												/>
											</FieldContent>
										</Field>
										<div className="flex flex-wrap gap-2">
											{quickAmounts.map((q) => (
												<Button
													key={q}
													type="button"
													variant={amount === q ? "default" : "outline"}
													size="sm"
													onClick={() =>
														setValue("amount", q, { shouldValidate: true })
													}
													className={amount === q ? "bg-primary-gradient" : ""}
												>
													${q}
												</Button>
											))}
										</div>
									</CardContent>
								</Card>

								<Card className="bg-card-gradient shadow-card border-border/50">
									<CardHeader>
										<CardTitle className="text-base">Payment Method</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										<Controller
											control={control}
											name="source"
											render={({ field }) => (
												<>
													{topUpMethods.map((method) => (
														<Button
															key={method.id}
															type="button"
															onClick={() => field.onChange(method.id)}
															className={`w-full flex items-center gap-4 p-4 rounded-lg border transition-all ${
																field.value === method.id
																	? "border-primary bg-primary/5"
																	: "border-border/50 hover:bg-accent/50"
															}`}
														>
															<div
																className={`p-2 rounded-lg ${field.value === method.id ? "bg-primary/10" : "bg-muted"}`}
															>
																<method.icon
																	className={`h-5 w-5 ${field.value === method.id ? "text-primary" : "text-muted-foreground"}`}
																/>
															</div>
															<div className="flex-1 text-left">
																<p className="font-medium">{method.label}</p>
																<p className="text-sm text-muted-foreground">
																	{method.description}
																</p>
															</div>
															<Badge variant="secondary" className="text-xs">
																{method.badge}
															</Badge>
														</Button>
													))}
												</>
											)}
										/>

										<Separator />

										<Button
											size="lg"
											type="submit"
											className="w-full bg-primary-gradient"
											disabled={
												!amount || isSubmitting || initiateDeposit.isPending
											}
										>
											<Wallet className="mr-2 h-4 w-4" />
											{initiateDeposit.isPending
												? "Processing..."
												: `Top Up ${amount ? `$${Number(amount).toFixed(2)}` : ""}`}
											<ArrowRight className="ml-2 h-4 w-4" />
										</Button>
									</CardContent>
								</Card>
							</form>
						</motion.div>

						<div className="space-y-6">
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								<Card className="bg-card-gradient shadow-card border-border/50">
									<CardContent className="p-6 space-y-4">
										<div className="flex items-center gap-3">
											<div className="p-2 rounded-full bg-success/10">
												<Shield className="h-5 w-5 text-success" />
											</div>
											<div>
												<p className="font-medium">Simulated top-up</p>
												<p className="text-sm text-muted-foreground">
													No real payment processor is connected yet
												</p>
											</div>
										</div>
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.3 }}
							>
								<Card className="bg-card-gradient shadow-card border-border/50">
									<CardHeader className="pb-4">
										<CardTitle className="text-base flex items-center gap-2">
											<Clock className="h-4 w-4 text-muted-foreground" />
											Recent Top-Ups
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{(recentTopUps?.items ?? []).length === 0 && (
											<p className="text-muted-foreground text-sm">
												No top-ups yet.
											</p>
										)}
										{recentTopUps?.items.map((item) => (
											<div
												key={item.id}
												className="flex items-center justify-between p-3 rounded-lg bg-accent/30"
											>
												<div>
													<p className="font-medium number-display">
														+
														<AnimatedNumber
															value={`${item.currency} ${item.amount.toFixed(2)}`}
														/>
													</p>
													<p className="text-sm text-muted-foreground">
														{item.description}
													</p>
												</div>
												<div className="text-right">
													<Badge
														variant="outline"
														className={
															item.status === "Completed"
																? "bg-success/10 text-success border-success/20 text-xs"
																: item.status === "Pending"
																	? "bg-warning/10 text-warning border-warning/20 text-xs"
																	: "bg-destructive/10 text-destructive border-destructive/20 text-xs"
														}
													>
														{item.status.toLowerCase()}
													</Badge>
													<p className="text-xs text-muted-foreground mt-1">
														{new Date(item.createdAt).toLocaleDateString()}
													</p>
												</div>
											</div>
										))}
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
					>
						<div className="flex items-center justify-between">
							<h2 className="text-2xl font-bold tracking-tight">
								Money Requests
							</h2>
						</div>
						<p className="text-muted-foreground mb-6 mt-1">
							Ask someone to pay you, or respond to incoming requests
						</p>
						<MoneyRequestsPanel />
					</motion.div>
				</main>
			</div>
		</DashboardLayout>
	);
}
