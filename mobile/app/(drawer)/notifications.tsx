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
import { CheckCircle, AlertTriangle, Bell, CreditCard, DollarSign } from "lucide-react-native";
import { Icon } from "@/components/ui/icon";
import {
  useMarkAllNotificationsRead,
  useMarkNotificationRead,
  useNotifications,
  useNotificationsUnreadCount,
} from "@/hooks/useNotifications";

const typeIcons: Record<string, typeof Bell> = {
  Payment: DollarSign,
  Security: AlertTriangle,
  Card: CreditCard,
  Bill: Bell,
  System: CheckCircle,
};

const typeColors: Record<string, string> = {
  Security: "bg-red-500/10",
  Payment: "bg-emerald-500/10",
  Card: "bg-primary/10",
  Bill: "bg-warning/10",
  System: "bg-muted",
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

export default function NotificationsScreen() {
  const { data: notifications, isLoading, isError, refetch } = useNotifications();
  const { data: unreadData } = useNotificationsUnreadCount();
  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();

  const unreadCount = unreadData?.count ?? 0;
  const hasUnread = (notifications ?? []).some((n) => !n.isRead);

  const handleMarkAll = async () => {
    try {
      await markAllRead.mutateAsync();
    } catch (err) {
      Alert.alert("Failed", err instanceof Error ? err.message : "Please try again");
    }
  };

  return (
    <ScrollView className="flex-1 p-6" contentContainerClassName="gap-4">
      <View className="gap-1">
        <Text className="font-bold text-3xl text-foreground">Notifications</Text>
        <Text className="text-muted-foreground">Alerts, updates, and activity from your account.</Text>
      </View>

      <Card>
        <CardHeader className="pb-2">
          <View className="flex-row items-center justify-between">
            <CardTitle>Recent</CardTitle>
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
              <Text className="mt-3 text-sm text-muted-foreground">Loading notifications...</Text>
            </View>
          ) : isError ? (
            <View className="items-center gap-3 py-6">
              <Text className="text-sm text-muted-foreground">Couldn't load notifications.</Text>
              <Button variant="outline" onPress={() => refetch()}>
                <Text>Retry</Text>
              </Button>
            </View>
          ) : (notifications ?? []).length === 0 ? (
            <View className="py-6">
              <Text className="text-center text-sm text-muted-foreground">
                No notifications yet.
              </Text>
            </View>
          ) : (
            (notifications as { id: string; title: string; body: string; type: string; isRead: boolean; createdAt: string }[]).map(
              (n, i) => {
                const IconComponent = typeIcons[n.type] || Bell;
                const color = typeColors[n.type] || "bg-muted";
                return (
                  <TouchableOpacity
                    key={n.id}
                    activeOpacity={0.7}
                    className={`flex-row items-start gap-3 px-4 py-3.5 ${i < (notifications ?? []).length - 1 ? "border-b border-border" : ""} ${!n.isRead ? "bg-accent/30" : ""}`}
                    onPress={() => {
                      if (!n.isRead) markRead.mutate(n.id);
                    }}
                  >
                    <View className={`rounded-full p-2 ${color}`}>
                      <Icon
                        as={IconComponent}
                        size={16}
                        className={n.type === "Security" ? "text-red-500" : n.type === "Payment" ? "text-emerald-500" : "text-muted-foreground"}
                      />
                    </View>
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between">
                        <Text className={`text-sm flex-1 mr-2 ${!n.isRead ? "font-semibold text-foreground" : "text-foreground"}`}>
                          {n.title}
                        </Text>
                        <Text className="text-muted-foreground text-xs">{timeAgo(n.createdAt)}</Text>
                      </View>
                      <Text className="text-muted-foreground text-sm mt-0.5" numberOfLines={2}>
                        {n.body}
                      </Text>
                    </View>
                    {!n.isRead && <View className="mt-1.5 h-2 w-2 rounded-full bg-primary" />}
                  </TouchableOpacity>
                );
              }
            )
          )}
        </CardContent>
      </Card>
    </ScrollView>
  );
}