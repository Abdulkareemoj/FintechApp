import { createFileRoute } from "@tanstack/react-router";
import {
	Bell,
	CheckCheck,
	CreditCard,
	MessageSquare,
	Shield,
	Trash2,
} from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import {
	useDeleteMessage,
	useInboxMessages,
	useInboxUnreadCount,
	useMarkAllMessagesRead,
	useMarkMessageRead,
} from "@/hooks/useInbox";
import DashboardLayout from "@/layout/DashboardLayout";
import type { InboxMessage } from "@/lib/api/inbox";

const typeIcons: Record<string, typeof MessageSquare> = {
	System: MessageSquare,
	Support: MessageSquare,
	Statement: Bell,
	Security: Shield,
	Promotion: CreditCard,
};

export const Route = createFileRoute("/(dashboard)/dashboard/inbox")({
	component: InboxPage,
});

function InboxPage() {
	const { data: messages, isPending, isError, refetch } = useInboxMessages();
	const { data: unreadData } = useInboxUnreadCount();
	const markRead = useMarkMessageRead();
	const markAllRead = useMarkAllMessagesRead();
	const deleteMessage = useDeleteMessage();
	const [openMessageId, setOpenMessageId] = useState<string | null>(null);

	const unreadCount = unreadData?.count ?? 0;
	const hasUnread = (messages ?? []).some((m) => !m.isRead);

	const handleOpen = (message: InboxMessage) => {
		setOpenMessageId(openMessageId === message.id ? null : message.id);
		if (!message.isRead) {
			markRead.mutate(message.id);
		}
	};

	const handleDelete = async (messageId: string) => {
		try {
			await deleteMessage.mutateAsync(messageId);
			if (openMessageId === messageId) setOpenMessageId(null);
			toast.success("Message deleted");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Delete failed");
		}
	};

	const handleMarkAll = async () => {
		try {
			await markAllRead.mutateAsync();
			toast.success("All messages marked as read");
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Update failed");
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
							<h1 className="font-bold text-3xl tracking-tight">Inbox</h1>
							<p className="mt-1 text-muted-foreground">
								Bank communications and updates
							</p>
						</div>
						{hasUnread && (
							<Button onClick={handleMarkAll} variant="outline">
								<CheckCheck className="mr-2 h-4 w-4" />
								Mark all read
							</Button>
						)}
					</motion.div>

					<motion.div
						animate={{ opacity: 1, y: 0 }}
						initial={{ opacity: 0, y: 20 }}
						transition={{ delay: 0.1 }}
					>
						<Card className="border-border/50 bg-card-gradient shadow-card">
							<CardHeader>
								<CardTitle className="flex items-center justify-between">
									<span>Messages</span>
									{unreadCount > 0 && (
										<Badge className="text-xs">{unreadCount} unread</Badge>
									)}
								</CardTitle>
								<CardDescription>Tap a message to expand it</CardDescription>
							</CardHeader>
							<CardContent>
								{isPending ? (
									<div className="flex justify-center py-10">
										<Spinner />
									</div>
								) : isError ? (
									<Empty className="border-0">
										<EmptyHeader>
											<EmptyTitle>Couldn't load messages</EmptyTitle>
											<EmptyDescription>
												Something went wrong while fetching your inbox.
											</EmptyDescription>
										</EmptyHeader>
										<Button onClick={() => refetch()} variant="outline">
											Retry
										</Button>
									</Empty>
								) : (messages ?? []).length === 0 ? (
									<Empty className="border-0">
										<EmptyHeader>
											<EmptyTitle>No messages yet</EmptyTitle>
											<EmptyDescription>
												Your bank communications will appear here.
											</EmptyDescription>
										</EmptyHeader>
									</Empty>
								) : (
									<div className="divide-y divide-border rounded-xl border border-border">
										{(messages ?? []).map((message) => {
											const Icon = typeIcons[message.type] ?? MessageSquare;
											const isOpen = openMessageId === message.id;
											return (
												<div
													className={`transition-colors ${message.isRead ? "" : "bg-accent/30"}`}
													key={message.id}
												>
													<Button
														className="flex w-full items-center gap-3 px-4 py-3.5 text-left hover:bg-accent/40"
														onClick={() => handleOpen(message)}
														type="button"
													>
														<div
															className={`rounded-full p-2 ${message.isRead ? "bg-muted" : "bg-primary/10"}`}
														>
															<Icon
																className={`h-4 w-4 ${message.isRead ? "text-muted-foreground" : "text-primary"}`}
															/>
														</div>
														<div className="min-w-0 flex-1">
															<div className="flex items-center justify-between gap-2">
																<p
																	className={`truncate text-sm ${message.isRead ? "text-foreground" : "font-semibold"}`}
																>
																	{message.subject}
																</p>
																<p className="shrink-0 text-muted-foreground text-xs">
																	{new Date(
																		message.createdAt,
																	).toLocaleDateString()}
																</p>
															</div>
															<p className="mt-0.5 truncate text-muted-foreground text-sm">
																From {message.from} · {message.type}
															</p>
														</div>
														{!message.isRead && (
															<span className="h-2 w-2 shrink-0 rounded-full bg-primary" />
														)}
													</Button>
													{isOpen && (
														<div className="bg-muted/30 px-4 py-4">
															<p className="text-muted-foreground text-sm">
																{message.body}
															</p>
															<div className="mt-3 flex gap-2">
																<Button
																	onClick={() => handleDelete(message.id)}
																	size="sm"
																	variant="outline"
																>
																	<Trash2 className="mr-1.5 h-3.5 w-3.5" />
																	Delete
																</Button>
															</div>
														</div>
													)}
												</div>
											);
										})}
									</div>
								)}
							</CardContent>
						</Card>
					</motion.div>
				</main>
			</div>
		</DashboardLayout>
	);
}
