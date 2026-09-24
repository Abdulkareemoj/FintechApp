import { createFileRoute } from "@tanstack/react-router";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { ChatList } from "@/components/messages/ChatList";
import { ConversationView } from "@/components/messages/ConversationView";
import type { Chat, Message } from "@/components/messages/types";
import { Button } from "@/components/ui/button";
import {
	Empty,
	EmptyDescription,
	EmptyHeader,
	EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";
import {
	useInboxMessages,
	useInboxUnreadCount,
	useMarkAllMessagesRead,
	useMarkMessageRead,
} from "@/hooks/useInbox";
import DashboardLayout from "@/layout/DashboardLayout";
import type { InboxMessage } from "@/lib/api/inbox";

export const Route = createFileRoute("/(dashboard)/dashboard/support/messages")(
	{ component: InboxPage },
);

function toChat(message: InboxMessage): Chat {
	return {
		id: message.id,
		name: message.from,
		initials: message.from.slice(0, 2).toUpperCase(),
		category: message.type,
		status: "closed",
		lastMessage: message.subject,
		timestamp: new Date(message.createdAt).toLocaleDateString(undefined, {
			month: "short",
			day: "numeric",
		}),
		unread: message.isRead ? undefined : 1,
	};
}

function toMessage(message: InboxMessage): Message {
	return {
		id: message.id,
		direction: "incoming",
		text: message.body,
		time: new Date(message.createdAt).toLocaleTimeString(undefined, {
			hour: "numeric",
			minute: "2-digit",
		}),
	};
}

function InboxPage() {
	const { data: messages, isPending, isError, refetch } = useInboxMessages();
	const { data: unreadData } = useInboxUnreadCount();
	const markRead = useMarkMessageRead();
	const markAllRead = useMarkAllMessagesRead();
	const [activeId, setActiveId] = useState<string | null>(null);
	const inbox = messages ?? [];
	const activeMessage =
		inbox.find((message) => message.id === activeId) ?? null;

	const handleSelect = (chat: Chat) => {
		setActiveId(chat.id);
		const message = inbox.find((item) => item.id === chat.id);
		if (message && !message.isRead) markRead.mutate(message.id);
	};

	const markAll = async () => {
		try {
			await markAllRead.mutateAsync();
			toast.success("All messages marked as read");
		} catch (error) {
			toast.error(error instanceof Error ? error.message : "Update failed");
		}
	};

	return (
		<DashboardLayout>
			<main className="min-h-screen bg-background px-6 py-8">
				<motion.div
					animate={{ opacity: 1, y: 0 }}
					className="mx-auto flex max-w-7xl flex-col justify-between gap-4 pb-6 md:flex-row md:items-center"
					initial={{ opacity: 0, y: 10 }}
				>
					<div>
						<h1 className="font-bold text-3xl tracking-tight">Messages</h1>
						<p className="mt-1 text-muted-foreground">
							Bank communications and account updates
						</p>
					</div>
					{(unreadData?.count ?? 0) > 0 ? (
						<Button onClick={markAll} variant="outline">
							Mark all read ({unreadData?.count})
						</Button>
					) : null}
				</motion.div>
				<motion.section
					animate={{ opacity: 1, y: 0 }}
					className="mx-auto grid h-[70vh] max-w-7xl overflow-hidden rounded-2xl border border-border bg-card shadow-card md:grid-cols-[340px_1fr]"
					initial={{ opacity: 0, y: 16 }}
				>
					{isPending ? (
						<div className="col-span-full flex items-center justify-center">
							<Spinner />
						</div>
					) : isError ? (
						<div className="col-span-full flex items-center justify-center">
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
						</div>
					) : inbox.length === 0 ? (
						<div className="col-span-full flex items-center justify-center">
							<Empty className="border-0">
								<EmptyHeader>
									<EmptyTitle>No messages yet</EmptyTitle>
									<EmptyDescription>
										Your bank communications will appear here.
									</EmptyDescription>
								</EmptyHeader>
							</Empty>
						</div>
					) : (
						<>
							<div className="border-r border-border">
								<ChatList
									activeId={activeId ?? undefined}
									chats={inbox.map(toChat)}
									onSelect={handleSelect}
									searchPlaceholder="Search messages..."
									title="Chats"
								/>
							</div>
							<div className="min-w-0">
								{activeMessage ? (
									<ConversationView
										chat={toChat(activeMessage)}
										messages={[toMessage(activeMessage)]}
										readOnly
									/>
								) : (
									<div className="flex h-full items-center justify-center text-muted-foreground text-sm">
										Select a message to read it
									</div>
								)}
							</div>
						</>
					)}
				</motion.section>
			</main>
		</DashboardLayout>
	);
}
