import { Pressable, View } from "react-native";
import { Badge } from "@/components/ui/badge";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import type { Chat } from "./types";

interface Props {
  chat: Chat;
  active?: boolean;
  onPress?: () => void;
}

const statusLabel: Record<Chat["status"], string> = {
  open: "Open",
  progress: "In Progress",
  resolved: "Resolved",
  closed: "Closed",
};

export function ChatListItem({ chat, active, onPress }: Props) {
  return (
    <Pressable
      className={cn(
        "flex w-full flex-row items-center gap-3 border-b border-border/60 px-4 py-3.5",
        active && "bg-muted"
      )}
      onPress={onPress}
    >
      <View className="flex min-w-0 flex-1">
        <View className="flex-row items-center justify-between gap-2">
          <Text className="text-sm font-semibold text-foreground flex-1" numberOfLines={1}>
            {chat.name}
          </Text>
          <Text className="text-xs text-muted-foreground shrink-0">{chat.timestamp}</Text>
        </View>
        <View className="mt-1 flex-row items-center justify-between gap-2">
          <Text className="text-xs text-muted-foreground flex-1" numberOfLines={1}>
            {chat.lastMessage}
          </Text>
          <Badge variant={chat.status === "closed" ? "secondary" : "outline"}>
            <Text className="text-[10px]">{statusLabel[chat.status]}</Text>
          </Badge>
        </View>
      </View>
    </Pressable>
  );
}