import React from "react";
import { ActivityIndicator, View } from "react-native";
import { ChatList } from "@/components/messages/ChatList";
import { ConversationView } from "@/components/messages/ConversationView";
import type { Chat, Message } from "@/components/messages/types";
import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import { useInboxMessages, useInboxUnreadCount, useMarkAllMessagesRead, useMarkMessageRead } from "@/hooks/useInbox";
import type { InboxMessage } from "@/lib/api/inbox";

function toChat(message: InboxMessage): Chat {
  return { id: message.id, name: message.from, initials: message.from.slice(0, 2).toUpperCase(), category: message.type, status: "closed", lastMessage: message.subject, timestamp: new Date(message.createdAt).toLocaleDateString(undefined, { month: "short", day: "numeric" }), unread: message.isRead ? undefined : 1 };
}

function toMessage(message: InboxMessage): Message {
  return { id: message.id, direction: "incoming", text: message.body, time: new Date(message.createdAt).toLocaleTimeString(undefined, { hour: "numeric", minute: "2-digit" }) };
}

export default function MessagesScreen() {
  const { data: messages, isLoading, isError, refetch } = useInboxMessages();
  const { data: unread } = useInboxUnreadCount();
  const markRead = useMarkMessageRead();
  const markAllRead = useMarkAllMessagesRead();
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const inbox = messages ?? [];
  const activeMessage = inbox.find((message) => message.id === activeId) ?? null;
  const select = (chat: Chat) => { setActiveId(chat.id); const message = inbox.find((item) => item.id === chat.id); if (message && !message.isRead) markRead.mutate(message.id); };

  if (isLoading) return <View className="flex-1 items-center justify-center"><ActivityIndicator size="large" /><Text className="mt-3 text-muted-foreground">Loading messages...</Text></View>;
  if (isError) return <View className="flex-1 items-center justify-center gap-3"><Text className="text-muted-foreground">Couldn't load messages.</Text><Button onPress={() => refetch()} variant="outline"><Text>Retry</Text></Button></View>;
  if (activeMessage) return <ConversationView chat={toChat(activeMessage)} messages={[toMessage(activeMessage)]} onBack={() => setActiveId(null)} readOnly showBack />;

  return <View className="flex-1 bg-background"><View className="flex-row items-center justify-between px-4 pt-4"><Text className="text-muted-foreground">Bank communications and account updates</Text>{(unread?.count ?? 0) > 0 ? <Button onPress={() => markAllRead.mutate()} size="sm" variant="ghost"><Text>Mark all read</Text></Button> : null}</View><ChatList chats={inbox.map(toChat)} onSelect={select} searchPlaceholder="Search messages..." title="Chats" /></View>;
}
