import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Text } from "@/components/ui/text";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, CreditCard, Shield, Bell, Trash2, ChevronRight } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import {
  useDeleteMessage,
  useInboxMessages,
  useInboxUnreadCount,
  useMarkAllMessagesRead,
  useMarkMessageRead,
} from "@/hooks/useInbox";
import type { InboxMessage } from "@/lib/api/inbox";

const typeIcons: Record<string, typeof MessageSquare> = {
  System: MessageSquare,
  Support: MessageSquare,
  Statement: Bell,
  Security: Shield,
  Promotion: CreditCard,
};

function timeAgo(value: string) {
  const diff = Date.now() - new Date(value).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function MessagesScreen() {
  const { data: messages, isLoading, isError, refetch } = useInboxMessages();
  const { data: unreadData } = useInboxUnreadCount();
  const markRead = useMarkMessageRead();
  const markAllRead = useMarkAllMessagesRead();
  const deleteMessage = useDeleteMessage();
  const [openId, setOpenId] = React.useState<string | null>(null);

  const unreadCount = unreadData?.count ?? 0;
  const hasUnread = ((messages ?? []) as InboxMessage[]).some((m) => !m.isRead);

  const handleOpen = (message: InboxMessage) => {
    setOpenId(openId === message.id ? null : message.id);
    if (!message.isRead) {
      markRead.mutate(message.id);
    }
  };

  const handleMarkAll = async () => {
    try {
      await markAllRead.mutateAsync();
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Please try again");
    }
  };

  const handleDelete = (message: InboxMessage) => {
    Alert.alert("Delete message", `Delete "${message.subject}"?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: () =>
          deleteMessage.mutate(message.id, {
            onError: (err) =>
              Alert.alert("Failed", err instanceof Error ? err.message : "Please try again"),
          }),
      },
    ]);
  };

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Messages</Text>
        <Text className="text-muted-foreground">Bank communications and updates.</Text>
      </View>

      <Card>
        <CardHeader className="pb-2">
          <View className="flex-row items-center justify-between">
            <CardTitle>Inbox</CardTitle>
            <View className="flex-row items-center gap-2">
              {unreadCount > 0 && (
                <Badge>
                  <Text className="text-xs text-white">{unreadCount} new</Text>
                </Badge>
              )}
              {hasUnread && (
                <TouchableOpacity onPress={handleMarkAll}>
                  <Text className="text-primary text-sm font-medium">Mark all read</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <View className="items-center py-8">
              <ActivityIndicator size="large" className="text-primary" />
              <Text className="mt-3 text-sm text-muted-foreground">Loading messages...</Text>
            </View>
          ) : isError ? (
            <View className="items-center gap-3 py-6">
              <Text className="text-sm text-muted-foreground">Couldn't load messages.</Text>
              <Button variant="outline" onPress={() => refetch()}>
                <Text>Retry</Text>
              </Button>
            </View>
          ) : (messages ?? []).length === 0 ? (
            <View className="py-6">
              <Text className="text-center text-sm text-muted-foreground">
                No messages yet.
              </Text>
            </View>
          ) : (
            (messages as InboxMessage[]).map((c, i) => {
              const IconComponent = typeIcons[c.type] || MessageSquare;
              const isOpen = openId === c.id;
              return (
                <View key={c.id}>
                  <TouchableOpacity
                    activeOpacity={0.7}
                    className={`flex-row items-center gap-3 px-4 py-3.5 ${i < (messages ?? []).length - 1 ? "border-b border-border" : ""} ${!c.isRead ? "bg-accent/30" : ""}`}
                    onPress={() => handleOpen(c)}
                  >
                    <View className={`rounded-full p-2 ${c.isRead ? "bg-muted" : "bg-primary/10"}`}>
                      <Icon
                        as={IconComponent}
                        size={18}
                        className={c.isRead ? "text-muted-foreground" : "text-primary"}
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className={`text-sm flex-1 mr-2 ${!c.isRead ? "font-semibold text-foreground" : "text-foreground"}`}>
                          {c.subject}
                        </Text>
                        <Text className="text-muted-foreground text-xs">{timeAgo(c.createdAt)}</Text>
                      </View>
                      <Text className="text-muted-foreground text-sm mt-0.5" numberOfLines={1}>
                        {c.from} · {c.body}
                      </Text>
                    </View>
                    {!c.isRead && <View className="h-2 w-2 rounded-full bg-primary" />}
                  </TouchableOpacity>
                  {isOpen && (
                    <View className="border-b border-border bg-muted/30 px-4 py-3">
                      <Text className="text-sm text-muted-foreground">{c.body}</Text>
                      <TouchableOpacity
                        className="mt-3 flex-row items-center gap-1.5"
                        onPress={() => handleDelete(c)}
                      >
                        <Icon as={Trash2} size={16} className="text-destructive" />
                        <Text className="text-destructive text-sm font-medium">Delete</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              );
            })
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}