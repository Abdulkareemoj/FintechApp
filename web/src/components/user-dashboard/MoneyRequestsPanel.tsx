import { zodResolver } from "@hookform/resolvers/zod";
import {
	CheckCircle2,
	Clock,
	DollarSign,
	HandCoins,
	Mail,
	Phone,
	User,
	XCircle,
} from "lucide-react";
import { motion } from "motion/react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
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
import {
	SlidingTabsList,
	Tabs,
	TabsContent,
	TabsTrigger,
} from "@/components/ui/tabs";
import {
	useAcceptMoneyRequest,
	useCancelMoneyRequest,
	useCreateMoneyRequest,
	useDeclineMoneyRequest,
	useIncomingMoneyRequests,
	useOutgoingMoneyRequests,
} from "@/hooks/useMoneyRequests";
import { useWallets } from "@/hooks/useWallets";
import { generateIdempotencyKey } from "@/lib/idempotency";

const requestMoneySchema = z.object({
	requesterWalletId: z.string().min(1, "Select an account"),
	payerEmail: z.string().email("Enter a valid email"),
	amount: z.coerce.number().positive("Amount must be greater than 0"),
	description: z.string().max(500).optional(),
});
type RequestMoneyForm = z.infer<typeof requestMoneySchema>;
type FormInput = z.input<typeof requestMoneySchema>;
type FormOutput = z.output<typeof requestMoneySchema>;

const statusConfig: Record<string, { color: string; icon: typeof Clock }> = {
	pending: {
		color: "bg-warning/10 text-warning border-warning/20",
		icon: Clock,
	},
	paid: {
		color: "bg-success/10 text-success border-success/20",
		icon: CheckCircle2,
	},
	declined: {
		color: "bg-destructive/10 text-destructive border-destructive/20",
		icon: XCircle,
	},
	cancelled: {
		color: "bg-muted text-muted-foreground border-border",
		icon: XCircle,
	},
	expired: {
		color: "bg-muted text-muted-foreground border-border",
		icon: Clock,
	},
};

export function MoneyRequestsPanel() {
	const { data: wallets } = useWallets();
	const primaryWallet = wallets?.[0];
	const { data: outgoing } = useOutgoingMoneyRequests(1, 100);
	const { data: incoming } = useIncomingMoneyRequests(1, 50);
	const createRequest = useCreateMoneyRequest();
	const acceptRequest = useAcceptMoneyRequest();
	const declineRequest = useDeclineMoneyRequest();
	const cancelRequest = useCancelMoneyRequest();

	const {
		register,
		handleSubmit,
		control,
		setValue,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormInput, any, FormOutput>({
		resolver: zodResolver(requestMoneySchema),
		defaultValues: {
			requesterWalletId: "",
			payerEmail: "",
			amount: 0,
			description: "",
		},
	});

	useEffect(() => {
		if (primaryWallet) setValue("requesterWalletId", primaryWallet.id);
	}, [primaryWallet, setValue]);

	const onCreate = async (values: RequestMoneyForm) => {
		try {
			await createRequest.mutateAsync(values);
			toast.success("Money request sent");
			reset({
				requesterWalletId: values.requesterWalletId,
				payerEmail: "",
				amount: 0,
				description: "",
			});
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to send request",
			);
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

	const handleCancelRequest = async (requestId: string) => {
		try {
			await cancelRequest.mutateAsync(requestId);
			toast.success("Request cancelled");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Cancel failed");
		}
	};

	const pending = (incoming?.items ?? []).filter((r) => r.status === "Pending");

	return (
		<div className="grid gap-6 lg:grid-cols-3">
			<motion.div
				className="lg:col-span-2"
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.1 }}
			>
				<Card className="bg-card-gradient shadow-card border-border/50">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<HandCoins className="h-5 w-5 text-primary" />
							New Request
						</CardTitle>
					</CardHeader>
					<CardContent className="space-y-6">
						<form onSubmit={handleSubmit(onCreate)} className="space-y-6">
							<Controller
								control={control}
								name="requesterWalletId"
								render={({ field, fieldState }) => (
									<Field data-invalid={!!fieldState.error}>
										<FieldContent>
											<FieldLabel>Receive into</FieldLabel>
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
															{w.currencyCode} Wallet
														</SelectItem>
													))}
												</SelectContent>
											</Select>
											<FieldError
												errors={fieldState.error ? [fieldState.error] : []}
											/>
										</FieldContent>
									</Field>
								)}
							/>

							<Tabs defaultValue="email">
								<SlidingTabsList className="grid w-full grid-cols-3 bg-muted/50">
									<TabsTrigger value="email" className="gap-2">
										<Mail className="h-4 w-4" />
										Email
									</TabsTrigger>
									<TabsTrigger value="phone" className="gap-2" disabled>
										<Phone className="h-4 w-4" />
										Phone
									</TabsTrigger>
									<TabsTrigger value="user" className="gap-2" disabled>
										<User className="h-4 w-4" />
										Username
									</TabsTrigger>
								</SlidingTabsList>

								<TabsContent value="email" className="mt-6 space-y-4">
									<Field data-invalid={!!errors.payerEmail}>
										<FieldContent>
											<FieldLabel htmlFor="payerEmail">
												Recipient Email
											</FieldLabel>
											<Input
												id="payerEmail"
												type="email"
												placeholder="name@example.com"
												className="bg-muted/50"
												aria-invalid={!!errors.payerEmail}
												{...register("payerEmail")}
											/>
											<FieldError
												errors={errors.payerEmail ? [errors.payerEmail] : []}
											/>
										</FieldContent>
									</Field>
								</TabsContent>
							</Tabs>

							<Field data-invalid={!!errors.amount}>
								<FieldContent>
									<FieldLabel htmlFor="amount">Amount</FieldLabel>
									<div className="relative">
										<DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
										<Input
											type="number"
											step="0.01"
											placeholder="0.00"
											id="amount"
											aria-invalid={!!errors.amount}
											className="pl-12 text-3xl font-bold h-16 bg-muted/50 number-display"
											{...register("amount")}
										/>
									</div>
									<FieldError errors={errors.amount ? [errors.amount] : []} />
								</FieldContent>
							</Field>

							<Field>
								<FieldContent>
									<FieldLabel htmlFor="description">Note</FieldLabel>
									<Input
										id="description"
										placeholder="What's this for?"
										className="bg-muted/50"
										{...register("description")}
									/>
								</FieldContent>
							</Field>

							<Button
								size="lg"
								type="submit"
								className="w-full bg-primary-gradient"
								disabled={isSubmitting || createRequest.isPending}
							>
								<HandCoins className="mr-2 h-4 w-4" />
								{createRequest.isPending ? "Sending..." : "Send Request"}
							</Button>
						</form>
					</CardContent>
				</Card>
			</motion.div>

			<div className="space-y-6">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Card className="bg-card-gradient shadow-card border-border/50">
						<CardHeader className="pb-4">
							<CardTitle className="flex items-center gap-2 text-base">
								<Clock className="size-4 text-warning" />
								Pending Incoming Requests
							</CardTitle>
						</CardHeader>
						<CardContent className="flex flex-col gap-3">
							{pending.length === 0 && (
								<p className="text-muted-foreground text-sm">
									Nothing pending.
								</p>
							)}
							{pending.map((request) => (
								<div
									className="flex items-center justify-between rounded-lg bg-accent/30 p-3"
									key={request.id}
								>
									<div>
										<p className="font-medium">{request.requesterName}</p>
										<p className="text-muted-foreground text-sm">
											Requested {request.currency} {request.amount.toFixed(2)}
										</p>
									</div>
									<div className="flex gap-2">
										<Button
											size="sm"
											variant="outline"
											disabled={acceptRequest.isPending}
											onClick={() => handlePayRequest(request.id)}
										>
											Accept
										</Button>
										<Button
											size="sm"
											variant="outline"
											disabled={declineRequest.isPending}
											onClick={() => handleDeclineRequest(request.id)}
											className="text-destructive hover:text-destructive"
										>
											Decline
										</Button>
									</div>
								</div>
							))}
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
							<CardTitle className="text-base">Outgoing Requests</CardTitle>
						</CardHeader>
						<CardContent className="space-y-3">
							{(outgoing?.items ?? []).length === 0 && (
								<p className="text-muted-foreground text-sm">
									No requests yet.
								</p>
							)}
							{outgoing?.items.map((req) => {
								const statusKey = req.status.toLowerCase();
								const config = statusConfig[statusKey] ?? statusConfig.pending;
								const StatusIcon = config.icon;
								return (
									<div key={req.id} className="p-3 rounded-lg bg-accent/30">
										<div className="flex items-center justify-between">
											<p className="font-medium">{req.payerName}</p>
											<span className="font-semibold number-display">
												{req.currency} {req.amount.toFixed(2)}
											</span>
										</div>
										<div className="flex items-center justify-between mt-1">
											<p className="text-sm text-muted-foreground">
												{req.description ?? "—"} ·{" "}
												{new Date(req.createdAt).toLocaleDateString()}
											</p>
											<div className="flex items-center gap-2">
												{req.status === "Pending" && (
													<Button
														size="sm"
														variant="outline"
														disabled={cancelRequest.isPending}
														onClick={() => handleCancelRequest(req.id)}
														className="text-destructive hover:text-destructive"
													>
														Cancel
													</Button>
												)}
												<Badge
													variant="outline"
													className={`capitalize ${config.color}`}
												>
													<StatusIcon className="h-3 w-3 mr-1" />
													{statusKey}
												</Badge>
											</div>
										</div>
									</div>
								);
							})}
						</CardContent>
					</Card>
				</motion.div>
			</div>
		</div>
	);
}
