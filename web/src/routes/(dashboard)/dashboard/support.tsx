import { zodResolver } from "@hookform/resolvers/zod";
import { createFileRoute } from "@tanstack/react-router";
import { LifeBuoy, MessageSquare, Plus, Send } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { ChatList } from "@/components/messages/ChatList";
import { ConversationView } from "@/components/messages/ConversationView";
import type { Chat, Message } from "@/components/messages/types";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { Field, FieldContent, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useIsMobile } from "@/hooks/use-mobile";
import {
	useCreateTicket,
	useMyTickets,
	useSendTicketMessage,
	useTicketMessages,
} from "@/hooks/useSupport";
import DashboardLayout from "@/layout/DashboardLayout";
import type { SupportMessage, SupportTicket } from "@/lib/api/support";

const categories = [
	{ value: "Transaction", label: "Transaction Issue" },
	{ value: "Account", label: "Account Problem" },
	{ value: "Card", label: "Card Issue" },
	{ value: "Security", label: "Security Concern" },
	{ value: "Other", label: "Other" },
];

const ticketSchema = z.object({
	category: z.string().min(1, "Select a category"),
	subject: z.string().min(3, "Subject is too short"),
	description: z.string().min(10, "Describe your issue in a bit more detail"),
});

type FormInput = z.input<typeof ticketSchema>;
type FormOutput = z.output<typeof ticketSchema>;
type TicketForm = {
	category: string;
	subject: string;
	description: string;
};

const statusMap: Record<string, Chat["status"]> = {
	Open: "open",
	InProgress: "progress",
	Resolved: "resolved",
	Closed: "closed",
};

function initialsOf(name: string) {
	return name
		.split(/\s+/)
		.slice(0, 2)
		.map((w) => w[0]?.toUpperCase() ?? "")
		.join("");
}

function toChat(ticket: SupportTicket): Chat {
	return {
		id: ticket.id,
		name: ticket.subject,
		initials: initialsOf(ticket.subject),
		category: ticket.category,
		status: statusMap[ticket.status] ?? "open",
		lastMessage: ticket.lastMessage ?? ticket.description,
		timestamp: new Date(ticket.updatedAt).toLocaleDateString(),
	};
}

function toMessage(m: SupportMessage): Message {
	return {
		id: m.id,
		direction: m.isFromUser ? "outgoing" : "incoming",
		text: m.body,
		time: new Date(m.createdAt).toLocaleString(undefined, {
			hour: "numeric",
			minute: "2-digit",
		}),
		read: true,
	};
}

export const Route = createFileRoute("/(dashboard)/dashboard/support")({
	component: SupportPage,
});

function SupportPage() {
	const isMobile = useIsMobile();
	const { data: tickets, isPending, isError, refetch } = useMyTickets();
	const createTicket = useCreateTicket();

	const [activeId, setActiveId] = useState<string | null>(null);
	const [dialogOpen, setDialogOpen] = useState(false);

	const activeTicket = (tickets ?? []).find((t) => t.id === activeId) ?? null;
	const { data: messages, isPending: messagesPending } = useTicketMessages(
		activeTicket?.id ?? null,
	);
	const sendMessage = useSendTicketMessage(activeTicket?.id ?? null);

	const chats = (tickets ?? []).map(toChat);

	const {
		register,
		handleSubmit,
		control,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<FormInput, undefined, FormOutput>({
		resolver: zodResolver(ticketSchema),
		defaultValues: {
			category: "",
			subject: "",
			description: "",
		},
	});

	const onSubmit = async (values: TicketForm) => {
		try {
			const ticket = await createTicket.mutateAsync(values);
			toast.success("Ticket submitted — we'll get back to you soon");
			reset();
			setDialogOpen(false);
			setActiveId(ticket.id);
		} catch (err) {
			toast.error(
				err instanceof Error ? err.message : "Failed to submit ticket",
			);
		}
	};

	const handleSend = async (text: string) => {
		if (!activeTicket) return;
		try {
			await sendMessage.mutateAsync(text);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to send");
		}
	};

	return (
		<DashboardLayout>
			<div className="min-h-screen bg-background">
				<main className="mx-auto space-y-6 px-6 py-8">
					<motion.div
						animate={{ opacity: 1, y: 0 }}
						className="flex flex-col justify-between gap-4 pb-4 md:flex-row md:items-center"
						initial={{ opacity: 0, y: 10 }}
					>
						<div>
							<h1 className="font-bold text-3xl tracking-tight">
								Customer Support
							</h1>
							<p className="mt-1 text-muted-foreground">
								Get help with your account and transactions
							</p>
						</div>
						<div className="flex items-center gap-2">
							<a href="/dashboard/help">
								<Button variant="outline">
									<LifeBuoy className="mr-2 h-4 w-4" />
									Help Center
								</Button>
							</a>
							<Dialog onOpenChange={setDialogOpen} open={dialogOpen}>
								<DialogTrigger asChild>
									<Button className="bg-primary-gradient">
										<Plus className="mr-2 h-4 w-4" />
										New Ticket
									</Button>
								</DialogTrigger>
								<DialogContent className="sm:max-w-lg">
									<DialogHeader>
										<DialogTitle>New Support Ticket</DialogTitle>
										<DialogDescription>
											Describe your issue and we'll get back to you soon
										</DialogDescription>
									</DialogHeader>
									<form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
										<div className="space-y-2">
											<Field>
												<FieldContent>
													<Controller
														control={control}
														name="category"
														render={({ field }) => (
															<Select
																onValueChange={field.onChange}
																value={field.value || undefined}
															>
																<SelectTrigger className="bg-muted/50">
																	<SelectValue placeholder="Select a category" />
																</SelectTrigger>
																<SelectContent>
																	{categories.map((c) => (
																		<SelectItem key={c.value} value={c.value}>
																			{c.label}
																		</SelectItem>
																	))}
																</SelectContent>
															</Select>
														)}
													/>
												</FieldContent>
												{errors.category && (
													<FieldError>{errors.category.message}</FieldError>
												)}
											</Field>
										</div>

										<div className="space-y-2">
											<Field>
												<FieldContent>
													<Input
														className="bg-muted/50"
														placeholder="Brief description of your issue"
														{...register("subject")}
													/>
												</FieldContent>
												{errors.subject && (
													<FieldError>{errors.subject.message}</FieldError>
												)}
											</Field>
										</div>

										<div className="space-y-2">
											<Field>
												<FieldContent>
													<Textarea
														className="resize-none bg-muted/50"
														placeholder="Please provide as much detail as possible..."
														rows={6}
														{...register("description")}
													/>
												</FieldContent>
												{errors.description && (
													<FieldError>{errors.description.message}</FieldError>
												)}
											</Field>
										</div>

										<Button
											className="w-full bg-primary-gradient"
											disabled={isSubmitting}
											type="submit"
										>
											<Send className="mr-2 h-4 w-4" />
											{isSubmitting ? "Submitting..." : "Submit Ticket"}
										</Button>
									</form>
								</DialogContent>
							</Dialog>
						</div>
					</motion.div>

					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="overflow-hidden border-border/50 bg-card-gradient shadow-card">
							{isPending ? (
								<div className="flex h-64 items-center justify-center">
									<Spinner />
								</div>
							) : isError ? (
								<Empty>
									<EmptyHeader>
										<EmptyTitle>Couldn't load tickets</EmptyTitle>
										<EmptyDescription>
											<Button
												onClick={() => refetch()}
												size="sm"
												variant="outline"
											>
												Retry
											</Button>
										</EmptyDescription>
									</EmptyHeader>
								</Empty>
							) : (tickets ?? []).length === 0 ? (
								<Empty>
									<EmptyHeader>
										<EmptyTitle>No tickets yet</EmptyTitle>
										<EmptyDescription>
											Create a ticket to start a conversation with our support
											team.
										</EmptyDescription>
									</EmptyHeader>
								</Empty>
							) : isMobile ? (
								activeTicket ? (
									<ConversationView
										chat={toChat(activeTicket)}
										messages={(messages ?? []).map(toMessage)}
										onBack={() => setActiveId(null)}
										onSend={handleSend}
										showBack
										sending={sendMessage.isPending}
									/>
								) : (
									<div className="h-[70vh]">
										<ChatList
											activeId={activeId ?? undefined}
											chats={chats}
											onNew={() => setDialogOpen(true)}
											onSelect={(c) => setActiveId(c.id)}
										/>
									</div>
								)
							) : (
								<div className="grid h-[70vh] grid-cols-[340px_1fr]">
									<div className="border-r border-border">
										<ChatList
											activeId={activeId ?? undefined}
											chats={chats}
											onNew={() => setDialogOpen(true)}
											onSelect={(c) => setActiveId(c.id)}
										/>
									</div>
									<div className="min-w-0">
										{activeTicket ? (
											messagesPending ? (
												<div className="flex h-full items-center justify-center">
													<Spinner />
												</div>
											) : (
												<ConversationView
													chat={toChat(activeTicket)}
													messages={(messages ?? []).map(toMessage)}
													onSend={handleSend}
													sending={sendMessage.isPending}
												/>
											)
										) : (
											<div className="flex h-full items-center justify-center text-sm text-muted-foreground">
												Select a ticket to view the conversation
											</div>
										)}
									</div>
								</div>
							)}
						</Card>
					</motion.div>

					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.2 }}
					>
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardHeader>
								<CardTitle className="flex items-center gap-2">
									<MessageSquare className="h-5 w-5 text-primary" />
									Other ways to reach us
								</CardTitle>
								<CardDescription>
									Prefer a different channel? We're available around the clock.
								</CardDescription>
							</CardHeader>
							<CardContent className="grid gap-3 sm:grid-cols-2">
								<div className="flex items-center gap-3 rounded-xl bg-accent/30 p-4">
									<div className="rounded-lg bg-primary/10 p-2.5 text-primary">
										<Send className="h-5 w-5" />
									</div>
									<div>
										<p className="font-medium text-sm">Email</p>
										<p className="text-muted-foreground text-sm">
											support@finpay.com
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3 rounded-xl bg-accent/30 p-4">
									<div className="rounded-lg bg-primary/10 p-2.5 text-primary">
										<MessageSquare className="h-5 w-5" />
									</div>
									<div>
										<p className="font-medium text-sm">Live Chat</p>
										<p className="text-muted-foreground text-sm">
											24/7 instant messaging
										</p>
									</div>
								</div>
							</CardContent>
						</Card>
					</motion.div>
				</main>
			</div>
		</DashboardLayout>
	);
}
