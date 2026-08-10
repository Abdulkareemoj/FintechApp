// ================================================================
//FILE: src/routes/(dashboard)/dashboard/send-money.tsx
// ================================================================

import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import {
	ArrowRight,
	Check,
	Clock,
	Mail,
	Phone,
	Search,
	Send,
	User,
	Users,
	X,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { SuccessCheck } from "@/components/shared/SuccessCheck";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Field,
	FieldContent,
	FieldError,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
	SlidingTabsList,
	Tabs,
	TabsContent,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	useAcceptMoneyRequest,
	useDeclineMoneyRequest,
	useIncomingMoneyRequests,
} from "@/hooks/useMoneyRequests";
import { useRecipientLookup } from "@/hooks/useRecipientLookup";
import {
	useCreateTransfer,
	useRecentRecipients,
} from "@/hooks/useTransactions";
import { useWallets } from "@/hooks/useWallets";
import DashboardLayout from "@/layout/DashboardLayout";
import type { RecipientLookup } from "@/lib/api/recipients";
import { generateIdempotencyKey } from "@/lib/idempotency";

export const Route = createFileRoute("/(dashboard)/dashboard/send-money")({
	component: SendMoneyPage,
});

const sendMoneySchema = z.object({
	walletId: z.string().min(1, "Select an account"),
	recipientEmail: z.email("Enter a valid email"),
	amount: z.coerce.number().positive("Amount must be greater than 0"),
	description: z.string().max(500).optional(),
});
type SendMoneyForm = z.infer<typeof sendMoneySchema>;
type FormInput = z.input<typeof sendMoneySchema>; 
type FormOutput = z.output<typeof sendMoneySchema>;

function SendMoneyPage() {
	const { data: wallets } = useWallets();
	const primaryWallet = wallets?.[0];

	const {
		register,
		handleSubmit,
		control,
		watch,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormInput, undefined, FormOutput>({
		resolver: zodResolver(sendMoneySchema),
		defaultValues: {
			walletId: "",
			recipientEmail: "",
			amount: 0,
			description: "",
		},
	});

	useEffect(() => {
		if (primaryWallet)
			setValue("walletId", primaryWallet.id, { shouldValidate: false });
	}, [primaryWallet, setValue]);

	const selectedWalletId = watch("walletId");
	const selectedWallet = wallets?.find((w) => w.id === selectedWalletId);
	const recipientEmail = watch("recipientEmail");

	const [foundRecipient, setFoundRecipient] = useState<RecipientLookup | null>(
		null,
	);
	const [lastSentName, setLastSentName] = useState<string | null>(null);
	const lookup = useRecipientLookup();
	const transfer = useCreateTransfer();
	const { data: recentRecipients } = useRecentRecipients(5);
	const { data: incomingRequests } = useIncomingMoneyRequests(1, 5);
	const acceptRequest = useAcceptMoneyRequest();
	const declineRequest = useDeclineMoneyRequest();

	// Recipient result goes stale if email or source-wallet currency changes
	useEffect(() => {
		setFoundRecipient(null);
	}, []);

	const handleFindRecipient = async (emailOverride?: string) => {
		const email = emailOverride ?? recipientEmail;
		if (!selectedWallet || !email) return;
		try {
			const result = await lookup.mutateAsync({
				identifier: email,
				currency: selectedWallet.currencyCode,
			});
			setFoundRecipient(result);
			if (emailOverride) setValue("recipientEmail", emailOverride);
		} catch (err) {
			setFoundRecipient(null);
			toast.error(err instanceof Error ? err.message : "Recipient not found");
		}
	};

	const onSubmit = async (values: SendMoneyForm) => {
		if (!foundRecipient) {
			toast.error("Find the recipient before sending");
			return;
		}
		try {
			await transfer.mutateAsync({
				idempotencyKey: generateIdempotencyKey(),
				fromWalletId: values.walletId,
				toWalletId: foundRecipient.walletId,
				amount: values.amount,
				description: values.description,
			});
			toast.success(
				`Sent ${selectedWallet?.currencyCode} ${values.amount.toFixed(2)} to ${foundRecipient.name}`,
			);
			setLastSentName(foundRecipient.name);
			reset({
				walletId: values.walletId,
				recipientEmail: "",
				amount: 0,
				description: "",
			});
			setFoundRecipient(null);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Transfer failed");
		}
	};

	const handlePayRequest = async (requestId: string) => {
		if (!primaryWallet) return;
		try {
			await acceptRequest.mutateAsync({
				requestId,
				req: {
					idempotencyKey: generateIdempotencyKey(),
					fromWalletId: primaryWallet.id,
				},
			});
			toast.success("Payment sent");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Payment failed");
		}
	};

	const handleDeclineRequest = async (requestId: string) => {
		try {
			await declineRequest.mutateAsync(requestId);
			toast.success("Request declined");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Decline failed");
		}
	};

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 10 }}
					>
						<h1 className="font-bold text-3xl tracking-tight">Send Money</h1>
						<p className="mt-1 text-muted-foreground">
							Transfer funds to anyone, anywhere
						</p>
					</motion.div>

					<div className="grid gap-6 lg:grid-cols-3">
						<motion.div
							animate={{ opacity: 1, y: 0 }}
							className="lg:col-span-2"
							initial={{ opacity: 0, y: 20 }}
							transition={{ delay: 0.1 }}
						>
							<Card className="border-border/50 bg-card-gradient shadow-card">
								<CardHeader>
									<CardTitle className="flex items-center gap-2">
										<Send className="size-5 text-primary" />
										New Transfer
									</CardTitle>
								</CardHeader>
								<CardContent className="flex flex-col gap-6">
									<form
										onSubmit={handleSubmit(onSubmit)}
										className="flex flex-col gap-6"
									>
										<Controller
											control={control}
											name="walletId"
											render={({ field, fieldState }) => (
												<Field data-invalid={!!fieldState.error}>
													<FieldContent>
														<FieldLabel>From</FieldLabel>
														<Select
															value={field.value}
															onValueChange={field.onChange}
														>
															<SelectTrigger className="bg-muted/50">
																<SelectValue placeholder="Select account" />
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
															errors={
																fieldState.error ? [fieldState.error] : []
															}
														/>
													</FieldContent>
												</Field>
											)}
										/>

										<Tabs defaultValue="email">
											<SlidingTabsList className="grid w-full grid-cols-3 bg-muted/50">
												<TabsTrigger className="gap-2" value="email">
													<Mail data-icon />
													Email
												</TabsTrigger>
												<TabsTrigger className="gap-2" value="phone" disabled>
													<Phone data-icon />
													Phone
												</TabsTrigger>
												<TabsTrigger className="gap-2" value="user" disabled>
													<User data-icon />
													Username
												</TabsTrigger>
											</SlidingTabsList>

											<TabsContent
												className="mt-6 flex flex-col gap-4"
												value="email"
											>
												<Field data-invalid={!!errors.recipientEmail}>
													<FieldContent>
														<FieldLabel htmlFor="recipientEmail">
															Recipient Email
														</FieldLabel>
														<div className="flex gap-2">
															<Input
																className="bg-muted/50"
																id="recipientEmail"
																placeholder="name@example.com"
																type="email"
																aria-invalid={!!errors.recipientEmail}
																{...register("recipientEmail")}
															/>
															<Button
																type="button"
																variant="secondary"
																disabled={!recipientEmail || lookup.isPending}
																onClick={() => handleFindRecipient()}
															>
																{lookup.isPending ? (
																	<Spinner data-icon />
																) : (
																	<Search data-icon />
																)}
																Find
															</Button>
														</div>
														<FieldError
															errors={
																errors.recipientEmail
																	? [errors.recipientEmail]
																	: []
															}
														/>
													</FieldContent>
												</Field>

												{foundRecipient && (
													<div className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 p-3">
														<Avatar className="size-9">
															<AvatarFallback>
																{foundRecipient.name[0]}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="font-medium text-sm">
																{foundRecipient.name}
															</p>
															<p className="text-muted-foreground text-xs">
																{foundRecipient.email}
															</p>
														</div>
													</div>
												)}
											</TabsContent>
										</Tabs>

										<Field data-invalid={!!errors.amount}>
											<FieldContent>
												<FieldLabel htmlFor="amount">Amount</FieldLabel>
												<Input
													className="number-display h-16 bg-muted/50 font-bold text-3xl"
													id="amount"
													placeholder="0.00"
													type="number"
													step="0.01"
													aria-invalid={!!errors.amount}
													{...register("amount")}
												/>
												<p className="text-muted-foreground text-sm">
													Available balance:{" "}
													{selectedWallet
														? `${selectedWallet.currencyCode} ${selectedWallet.balance.toLocaleString(
																undefined,
																{ minimumFractionDigits: 2 },
															)}`
														: "—"}
												</p>
												<FieldError
													errors={errors.amount ? [errors.amount] : []}
												/>
											</FieldContent>
										</Field>

										<Field>
											<FieldContent>
												<FieldLabel htmlFor="description">
													Note (Optional)
												</FieldLabel>
												<Input
													className="bg-muted/50"
													id="description"
													placeholder="What's this for?"
													{...register("description")}
												/>
											</FieldContent>
										</Field>

										<Button
											className="w-full bg-primary-gradient"
											size="lg"
											type="submit"
											disabled={
												!foundRecipient || isSubmitting || transfer.isPending
											}
										>
											{transfer.isPending ? (
												<Spinner data-icon />
											) : (
												<Send data-icon />
											)}
											Send Money
											{transfer.isPending ? null : <ArrowRight data-icon />}
										</Button>
									</form>

									{lastSentName && (
										<div
											key={lastSentName}
											className="flex items-center gap-3 rounded-lg border border-success/30 bg-success/5 px-4 py-3"
										>
											<SuccessCheck className="size-8 text-success" />
											<div>
												<p className="font-medium text-sm">Transfer complete</p>
												<p className="text-muted-foreground text-xs">
													Paid {lastSentName}. It's on the way.
												</p>
											</div>
										</div>
									)}
								</CardContent>
							</Card>
						</motion.div>

						<div className="space-y-6">
							<motion.div
								animate={{ opacity: 1, y: 0 }}
								initial={{ opacity: 0, y: 20 }}
								transition={{ delay: 0.2 }}
							>
								<Card className="border-border/50 bg-card-gradient shadow-card">
									<CardHeader className="pb-4">
										<CardTitle className="flex items-center gap-2 text-base">
											<Users className="size-4 text-primary" />
											Recent Recipients
										</CardTitle>
									</CardHeader>
									<CardContent className="flex flex-col gap-3">
										{(recentRecipients ?? []).length === 0 && (
											<p className="text-muted-foreground text-sm">
												No recent recipients yet.
											</p>
										)}
										{recentRecipients?.map((person) => (
											<Button
												className="flex w-full items-center gap-3 rounded-lg p-2 text-left transition-colors hover:bg-accent/50"
												key={person.userId}
												variant="ghost"
												type="button"
												onClick={() => handleFindRecipient(person.email)}
											>
												<Avatar className="size-10">
													<AvatarFallback>{person.name[0]}</AvatarFallback>
												</Avatar>
												<div className="min-w-0 flex-1">
													<p className="truncate font-medium">{person.name}</p>
													<p className="truncate text-muted-foreground text-sm">
														{person.email}
													</p>
												</div>
												<ArrowRight className="size-4 text-muted-foreground" />
											</Button>
										))}
									</CardContent>
								</Card>
							</motion.div>

							<motion.div
								animate={{ opacity: 1, y: 0 }}
								initial={{ opacity: 0, y: 20 }}
								transition={{ delay: 0.3 }}
							>
								<Card className="border-border/50 bg-card-gradient shadow-card">
									{/* Duplicates the Pending Incoming Requests card on /dashboard/top-up
									    (MoneyRequestsPanel) — kept here intentionally; shared cache keeps both in sync. */}
									<CardHeader className="pb-4">
										<CardTitle className="flex items-center gap-2 text-base">
											<Clock className="size-4 text-warning" />
											Pending Requests
										</CardTitle>
									</CardHeader>
									<CardContent className="flex flex-col gap-3">
										{(incomingRequests?.items ?? []).length === 0 && (
											<p className="text-muted-foreground text-sm">
												Nothing pending.
											</p>
										)}
										{incomingRequests?.items.map((request) => (
											<div
												className="flex items-center justify-between rounded-lg bg-accent/30 p-3"
												key={request.id}
											>
												<div>
													<p className="font-medium">{request.requesterName}</p>
													<p className="text-muted-foreground text-sm">
														Requested {request.currency}{" "}
														{request.amount.toFixed(2)}
													</p>
												</div>
												<div className="flex gap-2">
													<Button
														size="sm"
														variant="outline"
														disabled={acceptRequest.isPending}
														onClick={() => handlePayRequest(request.id)}
													>
														<Check data-icon />
													</Button>
													<Button
														size="sm"
														variant="outline"
														disabled={declineRequest.isPending}
														onClick={() => handleDeclineRequest(request.id)}
														className="text-destructive hover:text-destructive"
													>
														<X data-icon />
													</Button>
												</div>
											</div>
										))}
									</CardContent>
								</Card>
							</motion.div>
						</div>
					</div>
				</main>
			</div>
		</DashboardLayout>
	);
}
